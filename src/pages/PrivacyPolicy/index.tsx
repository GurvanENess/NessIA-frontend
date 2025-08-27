import {
  Eye,
  FileText,
  Lock,
  Mail,
  MapPin,
  Phone,
  Shield,
  Trash2,
} from "lucide-react";
import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#E7E9F2]">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-[#7C3AED]/10 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-[#7C3AED]" />
            </div>
            <div>
              <h1 className="text-3xl font-coolvetica font-bold text-gray-900">
                Politique de confidentialité
              </h1>
              <p className="text-gray-600 mt-2">
                Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>

          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed">
              Devant le développement des nouveaux outils de communication, il
              est nécessaire de porter une attention particulière à la
              protection de la vie privée. C'est pourquoi, nous nous engageons à
              respecter la confidentialité des renseignements personnels que
              nous collectons.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Collecte des renseignements personnels */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
              <FileText className="w-6 h-6 text-[#7C3AED]" />
              Collecte des renseignements personnels
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Informations collectées :
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#7C3AED]" />
                    Adresse électronique
                  </li>
                  <li className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#7C3AED]" />
                    Numéro de téléphone / télécopieur
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-gray-700 mb-3">
                  Les renseignements personnels que nous collectons sont
                  recueillis au travers de formulaires et grâce à
                  l'interactivité établie entre vous et notre site Web. Nous
                  utilisons également, comme indiqué dans la section suivante,
                  des fichiers témoins et/ou journaux pour réunir des
                  informations vous concernant.
                </p>

                <h4 className="font-medium text-gray-900 mb-2">
                  Formulaires et interactivité :
                </h4>
                <p className="text-gray-700 mb-3">
                  Vos renseignements personnels sont collectés par le biais de
                  formulaire, à savoir :
                </p>
                <ul className="list-disc list-inside text-gray-700 ml-4">
                  <li>Formulaire d'inscription au site Web</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Utilisation des informations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
              <Eye className="w-6 h-6 text-[#7C3AED]" />
              Utilisation des informations collectées
            </h2>

            <p className="text-gray-700 mb-4">
              Nous utilisons les renseignements ainsi collectés pour les
              finalités suivantes :
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Contact</h4>
                <p className="text-gray-600 text-sm">
                  Communication avec les utilisateurs et support client
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Services</h4>
                <p className="text-gray-600 text-sm">
                  Fourniture et amélioration de nos services
                </p>
              </div>
            </div>
          </div>

          {/* Droits des utilisateurs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
              <Shield className="w-6 h-6 text-[#7C3AED]" />
              Vos droits
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Droit d'opposition et de retrait */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Trash2 className="w-5 h-5 text-[#7C3AED]" />
                  Droit d'opposition et de retrait
                </h3>
                <p className="text-gray-700 mb-3">
                  Nous nous engageons à vous offrir un droit d'opposition et de
                  retrait quant à vos renseignements personnels.
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <strong>Droit d'opposition :</strong> Possibilité de refuser
                    que vos données soient utilisées à certaines fins.
                  </p>
                  <p>
                    <strong>Droit de retrait :</strong> Possibilité de demander
                    la suppression de vos données de nos listes.
                  </p>
                </div>
              </div>

              {/* Droit d'accès */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-[#7C3AED]" />
                  Droit d'accès
                </h3>
                <p className="text-gray-700 mb-3">
                  Nous nous engageons à reconnaître un droit d'accès et de
                  rectification aux personnes concernées désireuses de
                  consulter, modifier, voire radier les informations les
                  concernant.
                </p>
              </div>
            </div>
          </div>

          {/* Sécurité */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
              <Lock className="w-6 h-6 text-[#7C3AED]" />
              Sécurité
            </h2>

            <p className="text-gray-700 mb-6">
              Les renseignements personnels que nous collectons sont conservés
              dans un environnement sécurisé. Les personnes travaillant pour
              nous sont tenues de respecter la confidentialité de vos
              informations.
            </p>

            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Mesures de sécurité mises en place :
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-[#7C3AED] rounded-full"></div>
                Protocole SSL
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-[#7C3AED] rounded-full"></div>
                Gestion des accès - personne autorisée
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-[#7C3AED] rounded-full"></div>
                Gestion des accès - personne concernée
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-[#7C3AED] rounded-full"></div>
                Sauvegarde informatique
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-[#7C3AED] rounded-full"></div>
                Identifiant / mot de passe
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Note importante :</strong> Nous nous engageons à
                maintenir un haut degré de confidentialité en intégrant les
                dernières innovations technologiques. Toutefois, comme aucun
                mécanisme n'offre une sécurité maximale, une part de risque est
                toujours présente lors de l'utilisation d'Internet.
              </p>
            </div>
          </div>

          {/* Législation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
              <FileText className="w-6 h-6 text-[#7C3AED]" />
              Législation
            </h2>

            <p className="text-gray-700 mb-4">
              Nous nous engageons à respecter les dispositions législatives
              énoncées dans :
            </p>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">
                Règlement Européen sur la Protection des Données (RGPD)
              </h3>
              <p className="text-gray-600 text-sm">
                Conformité avec le cadre réglementaire européen pour la
                protection des données personnelles.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
              <Mail className="w-6 h-6 text-[#7C3AED]" />
              Pour exercer vos droits
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-[#7C3AED] mx-auto mb-3" />
                <h4 className="font-medium text-gray-900 mb-2">Adresse</h4>
                <p className="text-gray-600 text-sm">Code postal : 29000</p>
              </div>

              <div className="text-center">
                <Mail className="w-8 h-8 text-[#7C3AED] mx-auto mb-3" />
                <h4 className="font-medium text-gray-900 mb-2">Email</h4>
                <p className="text-gray-600 text-sm">eness@nessia.com</p>
              </div>

              <div className="text-center">
                <Phone className="w-8 h-8 text-[#7C3AED] mx-auto mb-3" />
                <h4 className="font-medium text-gray-900 mb-2">Site web</h4>
                <p className="text-gray-600 text-sm">nessia.ai/contact</p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#7C3AED] text-white px-6 py-3 rounded-lg hover:bg-[#6D28D9] transition-colors font-medium"
              >
                Nous contacter
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
