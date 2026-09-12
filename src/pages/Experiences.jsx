import { TimelineSection, TimelineItem } from '../components/Timeline';

const Experiences = () => (
    <TimelineSection id="experiences" title="Mon parcours">
        <TimelineItem
            heading="Technicien support applicatif & Administrateur Salesforce"
            subheading="HESS Automobile · Bougé-Chambalud"
            badge="CDI"
            meta="septembre 2026 – présent"
            description={[
                "Résolution de tickets collaborateurs",
                "Amélioration continue sur Salesforce",
            ]}
        />

        <TimelineItem
            heading="Chargé de projet ERP & SI"
            subheading="JOUFFRE · Villeurbanne"
            badge="Alternance"
            meta="août 2022 – sept. 2024"
            description={[
                "Déploiement de l'ERP Odoo et accompagnement des équipes utilisateurs",
                "Support informatique (postes de travail, réseau, bureautique) et gestion du parc",
                "Rédaction de procédures et documentation technique",
            ]}
        />

        <TimelineItem
            heading="Développeur"
            subheading="Akuiteo SAS · Lyon"
            badge="Stage"
            meta="mars 2022 – juin 2022"
            description={[
                "Développement de scripts et d'outils de gestion en Java et JavaScript",
                "Support informatique et ticketing",
            ]}
        />

        <TimelineItem
            heading="Développeur"
            subheading="IGESIS · Lyon"
            badge="Alternance"
            meta="oct. 2021 – févr. 2022"
            description={[
                "Réalisation d'une amélioration de l'application web (JavaScript)",
            ]}
        />

        <TimelineItem
            heading="Agent de support technique"
            subheading="Akuiteo SAS · Lyon"
            badge="Stage"
            meta="mai 2020 – juil. 2020"
            description={[
                "Catégorisation, qualification et réponse à des tickets clients",
            ]}
        />
    </TimelineSection>
);

export default Experiences;
