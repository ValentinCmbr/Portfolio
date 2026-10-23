import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clientIp, isSameOrigin, rateLimitKey, validate } from './lib.js';

const valid = { name: 'Alice', email: 'alice@example.com', message: 'Bonjour' };

test('validate accepte un message correct', () => {
    assert.equal(validate(valid), null);
});

test('validate refuse le honeypot, les champs vides ou trop longs', () => {
    assert.ok(validate({ ...valid, website: 'x' }));
    assert.ok(validate({ ...valid, name: '  ' }));
    assert.ok(validate({ ...valid, message: 'a'.repeat(2001) }));
    assert.ok(validate(null));
    assert.ok(validate({ ...valid, email: 42 }));
});

test('validate refuse CR/LF dans les champs réinjectés en en-tête', () => {
    assert.ok(validate({ ...valid, name: 'a\r\nBcc: x@y.z' }));
    assert.ok(validate({ ...valid, email: 'a@b.c\nBcc: x@y.z' }));
    assert.equal(validate({ ...valid, message: 'ligne 1\nligne 2' }), null);
});

test('validate refuse une adresse email mal formée', () => {
    assert.ok(validate({ ...valid, email: 'pas-une-adresse' }));
});

test('isSameOrigin exige du JSON et une Origin du même domaine', () => {
    const req = (headers) => ({ headers: { host: 'site.fr', ...headers } });
    assert.equal(isSameOrigin(req({ 'content-type': 'application/json; charset=utf-8' })), true);
    assert.equal(isSameOrigin(req({ 'content-type': 'application/json', origin: 'https://site.fr' })), true);
    assert.equal(isSameOrigin(req({ 'content-type': 'text/plain' })), false);
    assert.equal(isSameOrigin(req({ 'content-type': 'application/json', origin: 'https://evil.fr' })), false);
});

test('clientIp ignore X-Forwarded-For', () => {
    const req = { headers: { 'x-forwarded-for': '6.6.6.6' }, socket: { remoteAddress: '127.0.0.1' } };
    assert.equal(clientIp(req), '127.0.0.1');
    req.headers['cf-connecting-ip'] = '1.2.3.4';
    assert.equal(clientIp(req), '1.2.3.4');
});

test('rateLimitKey regroupe les IPv6 par /64', () => {
    assert.equal(rateLimitKey('1.2.3.4'), '1.2.3.4');
    assert.equal(rateLimitKey('2001:db8:a:b::1'), '2001:db8:a:b::/64');
    assert.equal(rateLimitKey('2001:0db8:000a:000b:1:2:3:4'), '2001:db8:a:b::/64');
    assert.equal(rateLimitKey('2001:db8::1'), '2001:db8:0:0::/64');
    assert.equal(rateLimitKey('unknown'), 'unknown');
});
