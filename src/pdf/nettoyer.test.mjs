// Tests du nettoyeur de /pdf/ : le fichier d'une fic vient de n'importe où,
// rien d'exécutable ni de chargé à distance ne doit passer.
// Lancer : npm test (node --test, DOM fourni par jsdom).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { nettoyerFic } from './nettoyer.js';

const nettoyer = (corps, tete = '') => {
  const { window } = new JSDOM('');
  const fic = nettoyerFic(`<html><head>${tete}</head><body>${corps}</body></html>`, window);
  const div = window.document.createElement('div');
  div.append(fic.contenu);
  return { ...fic, html: div.innerHTML, div };
};

test('retire scripts, gestionnaires, styles et formulaires', () => {
  const { html } = nettoyer(`
    <script>alert(1)</script>
    <p onclick="alert(1)" style="color:red">texte</p>
    <img src="x" onerror="alert(1)">
    <style>body{background:url(https://pistage.example/)}</style>
    <form action="https://pistage.example/"><input name="q"></form>
    <iframe src="https://pistage.example/"></iframe>`);
  assert.doesNotMatch(html, /script|onclick|onerror|style=|<form|<input|<iframe|pistage/i);
  assert.match(html, /<p>texte<\/p>/);
});

test('SVG et MathML sont retirés avec leur contenu', () => {
  const { html } = nettoyer('<svg><a href="javascript:alert(1)"><text>x</text></a></svg><math><mi>y</mi></math><p>ok</p>');
  assert.equal(html, '<p>ok</p>');
});

test('liens : seuls http(s) et les ancres valides passent', () => {
  const { div } = nettoyer(`
    <a href="javascript:alert(1)">a</a>
    <a href="JaVaScRiPt:alert(1)">b</a>
    <a href="data:text/html,<script>alert(1)</script>">c</a>
    <a href="/relatif">d</a>
    <a href="https://exemple.org/">e</a>
    <a href="#chap1">f</a>`);
  const hrefs = [...div.querySelectorAll('a')].map((a) => a.getAttribute('href'));
  assert.deepEqual(hrefs, [null, null, null, null, 'https://exemple.org/', '#f-chap1']);
  const externe = div.querySelectorAll('a')[4];
  assert.equal(externe.getAttribute('rel'), 'noopener noreferrer');
});

test('images distantes en attente dans data-src, images intégrées affichées', () => {
  const png = 'data:image/png;base64,iVBORw0KGgo=';
  const { div, imagesDistantes } = nettoyer(`
    <img src="https://exemple.org/a.png" alt="carte">
    <img src="http://exemple.org/b.png">
    <img src="${png}">
    <img src="DATA:image/gif;base64,R0lGODlh">
    <img src="data:image/svg+xml,<svg onload=alert(1)>">
    <img srcset="https://pistage.example/x.png 2x">`);
  const imgs = [...div.querySelectorAll('img')];
  assert.equal(imgs.length, 4, 'le SVG et l\'image sans src sont retirés');
  assert.equal(imagesDistantes, 2);
  assert.equal(imgs[0].getAttribute('data-src'), 'https://exemple.org/a.png');
  assert.equal(imgs[1].getAttribute('data-src'), 'https://exemple.org/b.png', 'http passe en https');
  for (const img of imgs.slice(0, 2)) assert.equal(img.hasAttribute('src'), false);
  assert.equal(imgs[2].getAttribute('src'), png);
  assert.equal(imgs[3].getAttribute('src'), 'DATA:image/gif;base64,R0lGODlh');
  assert.equal(imgs[0].getAttribute('alt'), 'carte');
  assert.equal(imgs[1].getAttribute('alt'), '');
  assert.ok(imgs.every((i) => i.getAttribute('referrerpolicy') === 'no-referrer'));
});

test('id et classes préfixés, les autres attributs ignorés', () => {
  const { div } = nettoyer('<div id="chapters" class="d-none userstuff" name="x" data-x="1" align="center"><p>t</p></div>');
  const el = div.firstElementChild;
  assert.equal(el.id, 'f-chapters');
  assert.equal(el.className, 'f-d-none f-userstuff aligne-center');
  assert.equal(el.attributes.length, 2);
});

test('métadonnées : titre, auteur, langue validée, chapitres', () => {
  const fic = nettoyer(
    '<h1>Le titre</h1><a rel="author">Autrice</a><div id="chapters"><h2>1</h2><p>un deux</p><h2>2</h2><p>trois</p></div>',
    '<title>Titre de secours</title>',
  );
  assert.equal(fic.titre, 'Le titre');
  assert.equal(fic.auteur, 'Autrice');
  assert.equal(fic.chapitres, 2);
  assert.equal(fic.mots, 5);
  const { window } = new JSDOM('');
  const piegee = nettoyerFic('<html lang="fr&quot; onload=&quot;x"><body><p>t</p></body></html>', window);
  assert.equal(piegee.langue, '');
});
