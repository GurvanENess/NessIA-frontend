import { ArrowUpRight, Shield } from "lucide-react";
import React from "react";

const PrivacyTab: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-[#7C3AED]/10 rounded-full flex items-center justify-center">
          <Shield className="w-6 h-6 text-[#7C3AED]" />
        </div>
        <h2 className="text-2xl font-coolvetica font-semibold text-gray-900">
          Confidentialité des données
        </h2>
      </div>

      {/* Introduction */}
      <div className="mb-8">
        <p className="text-gray-700 text-lg leading-relaxed">
          NessIA s'engage pour la transparence des pratiques en matière de
          données.
        </p>
        <p className="text-gray-600 mt-4 leading-relaxed">
          La protection de vos données est une priorité. Découvrez comment vos
          informations sont protégées lors de l'utilisation de NessIA, et
          consultez notre{" "}
          <a
            href="/privacy-policy"
            className="text-[#7C3AED] hover:text-[#6D28D9] underline inline-flex items-center gap-1"
          >
            Politique de confidentialité
            <ArrowUpRight className="w-4 h-4" />
          </a>{" "}
          pour plus de détails.
        </p>
      </div>

      {/* Data Protection Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Comment nous protégeons vos données
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 bg-[#7C3AED] rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-gray-700">
              Par défaut, NessIA n'entraîne pas ses modèles génératifs sur vos
              conversations.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 bg-[#7C3AED] rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-gray-700">
              NessIA ne vend pas vos données à des tiers.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 bg-[#7C3AED] rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-gray-700">
              NessIA supprime vos données rapidement sur demande, sauf en cas de
              violations des règles de sécurité ou de conversations que vous
              avez partagées via des retours d'expérience.
            </span>
          </li>
        </ul>
      </div>

      {/* Data Usage Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Comment nous utilisons vos données
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 bg-[#7C3AED] rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-gray-700">
              NessIA peut utiliser les conversations signalées pour violation
              des règles de sécurité afin d'assurer la sécurité de nos systèmes
              pour tous les utilisateurs.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 bg-[#7C3AED] rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-gray-700">
              NessIA peut utiliser votre adresse e-mail pour la vérification du
              compte, la facturation et les communications et le marketing
              dirigés par NessIA (par exemple, des e-mails concernant les
              nouvelles offres et fonctionnalités).
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 bg-[#7C3AED] rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-gray-700">
              NessIA peut effectuer des analyses agrégées et anonymisées des
              données pour comprendre comment les utilisateurs utilisent nos
              services.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 bg-[#7C3AED] rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-gray-700">
              NessIA peut proposer des fonctionnalités supplémentaires qui nous
              permettront de collecter et d'utiliser davantage de vos données.
              Vous garderez toujours le contrôle et pourrez désactiver ces
              fonctionnalités dans les paramètres de votre compte.
            </span>
          </li>
        </ul>
      </div>

      {/* Call to Action */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">
          Besoin de plus d'informations ?
        </h4>
        <p className="text-gray-600 mb-4">
          Consultez notre politique de confidentialité complète pour tous les
          détails sur la collecte, l'utilisation et la protection de vos
          données.
        </p>
        <a
          href="/privacy-policy"
          className="inline-flex items-center gap-2 bg-[#7C3AED] text-white px-6 py-3 rounded-lg hover:bg-[#6D28D9] transition-colors font-medium"
        >
          Lire la politique complète
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

export default PrivacyTab;
