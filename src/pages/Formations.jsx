import { TimelineSection, TimelineItem } from '../components/Timeline';

const Formations = () => (
    <TimelineSection id="formations" title="Mes formations">
        <TimelineItem
            heading="Master · Manager de solutions digitales et data"
            subheading="ORT Lyon"
            badge="2022 – 2024"
        />

        <TimelineItem
            heading="Bachelor · Concepteur de Systèmes d'Informations"
            subheading="ORT Lyon"
            badge="2021 – 2022"
        />

        <TimelineItem
            heading="BTS · Systèmes numériques informatiques et réseaux"
            subheading="ORT Lyon"
            badge="2019 – 2021"
        />

        <TimelineItem
            heading="Baccalauréat · Sciences et technologies de l'industrie et du développement durable"
            subheading="Lycée Aragon & Picasso"
            badge="2016 – 2019"
        />
    </TimelineSection>
);

export default Formations;
