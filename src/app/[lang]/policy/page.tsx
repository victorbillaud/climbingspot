import { Flex, Text } from '@/components/common';

export default function Page() {
  return (
    <Flex
      direction="column"
      gap={4}
      horizontalAlign="left"
      verticalAlign="start"
      className="px-4 py-8 w-full max-w-4xl mx-auto"
    >
      <Text variant="h1">
        Conditions Générales d'Utilisation et Politique de Confidentialité
      </Text>
      <Text variant="body">
        Bienvenue sur Climbing Spot, une application dédiée au partage de spots
        d'escalade. En créant un compte sur notre plateforme, vous acceptez les
        conditions générales d'utilisation et la politique de confidentialité
        décrites ci-dessous.
      </Text>

      <Text variant="h2">Utilisation des spots d'escalade</Text>
      <Text variant="body">
        Les spots d'escalade partagés sur notre application sont fournis à titre
        indicatif. Il incombe à l'utilisateur de vérifier la réglementation
        locale et les conditions d'accès avant de se rendre sur chaque site.
        Climbing Spot décline toute responsabilité en cas d'accident ou
        d'infraction à la réglementation.
      </Text>

      <Text variant="h2">Publication d'un spot</Text>
      <Text variant="body">
        En publiant un spot sur Climbing Spot, vous acceptez que les
        informations suivantes soient rendues publiques :
      </Text>
      <ul>
        <li>Le nom du spot</li>
        <li>La description du spot</li>
        <li>Les photos associées au spot</li>
        <li>La position géographique du spot</li>
        <li>Le nom d'utilisateur de l'auteur du spot</li>
      </ul>

      <Text variant="h2">Collecte de Données Personnelles</Text>
      <Text variant="body">
        En créant un compte sur Climbing Spot, certaines données personnelles
        peuvent être collectées pour améliorer votre expérience utilisateur,
        notamment :
      </Text>
      <ul>
        <li>Adresse e-mail : Utilisée pour identifier votre compte.</li>
        <li>
          Position géographique : Collectée pour afficher les spots d'escalade
          proches de vous.
        </li>
      </ul>
      <Text variant="body">
        La position géographique n'est jamais enregistrée de manière permanente.
      </Text>

      <Text variant="h2">Confidentialité et Sécurité</Text>
      <Text variant="body">
        Nous nous engageons à protéger la confidentialité de vos données
        personnelles. Aucune information sensible n'est partagée sans votre
        consentement.
      </Text>

      <Text variant="h2">Propriété Intellectuelle</Text>
      <Text variant="body">
        Contenu publié par les utilisateurs : Vous conservez la propriété
        intellectuelle de vos photos, descriptions et autres contenus publiés.
        En publiant, vous accordez à Climbing Spot une licence non exclusive
        pour utiliser ce contenu dans le cadre des services proposés.
      </Text>
      <Text variant="body">
        Contenu de Climbing Spot : Les logos, marques, images, textes sont
        protégés par les droits de propriété intellectuelle. Toute utilisation
        non autorisée est interdite.
      </Text>

      <Text variant="h2">Suppression des données</Text>
      <Text variant="body">
        Données personnelles et contenu publié : Vous pouvez supprimer votre
        compte et vos données personnelles ainsi que votre contenu à tout
        moment. Climbing Spot s'engage à supprimer ces informations dans un
        délai de 30 jours pour les données personnelles et 7 jours pour le
        contenu.
      </Text>

      <Text variant="h2">Acceptation des Conditions</Text>
      <Text variant="body">
        Climbing spot fournit un service, sous réserve de votre conformité avec
        tous les termes, conditions et avis contenus ou référencés dans le
        présent document.
      </Text>

      <Text variant="h2">Conduite de l'utilisateur</Text>
      <Text variant="body">
        Vous acceptez de ne pas utiliser le service pour : Publier ou
        transmettre tout matériel qui est nuisible, menaçant, abusif ou
        autrement répréhensible. Violer toute loi ou réglementation. Porter
        atteinte aux droits d'autrui. Tenter de nuire à Climbing Spot.
      </Text>

      <Text variant="h2">Modération de contenu</Text>
      <Text variant="body">
        Nous nous réservons le droit de réviser et de supprimer tout contenu
        qui, à notre seul jugement, viole nos politiques.
      </Text>

      <Text variant="h2">Signalement de Contenu Répréhensible</Text>
      <Text variant="body">
        Les utilisateurs peuvent signaler le contenu répréhensible grâce à notre
        mécanisme de signalement. Nous nous engageons à traiter ces signalements
        dans les 24 heures.
      </Text>

      <Text variant="h2">Blocage des utilisateurs</Text>
      <Text variant="body">
        Les utilisateurs ont le droit de bloquer d'autres utilisateurs pour
        comportement abusif. Cette fonctionnalité est fournie pour votre
        sécurité et confort.
      </Text>
      <Text variant="h2">
        Modification des Conditions Générales d'Utilisation
      </Text>
      <Text variant="body">
        Climbing Spot se réserve le droit de modifier ces conditions à tout
        moment. Les utilisateurs seront informés des modifications.
      </Text>

      <Text variant="h2">Contact</Text>
      <Text variant="body">
        Pour toute question, veuillez nous contacter à{' '}
        <a href="mailto:contact@climbingspot.eu">contact@climbingspot.eu</a>.
      </Text>
    </Flex>
  );
}
