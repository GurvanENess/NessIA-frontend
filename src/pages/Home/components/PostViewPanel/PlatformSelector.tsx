import { FacebookIcon, Globe2, InstagramIcon } from "lucide-react";
import React, { useMemo } from "react";
import { getPlatformText } from "../../../../shared/utils/postUtils";
import { Post } from "../../../Posts/entities/PostTypes";

export interface PlatformOption {
  id: number;
  value: Post["platform"];
  accountName?: string | null;
  isConnected: boolean;
}

interface PlatformSelectorProps {
  options: PlatformOption[];
  selectedPlatformId: number | null;
  onSelectPlatform: (platformId: number) => void;
  disabled?: boolean;
}

const getPlatformIcon = (platform: Post["platform"]) => {
  switch (platform) {
    case "instagram":
      return <InstagramIcon className="h-4 w-4 text-[#E1306C]" />;
    case "facebook":
      return <FacebookIcon className="h-4 w-4 text-[#1877F2]" />;
    default:
      return <Globe2 className="h-4 w-4 text-gray-600" />;
  }
};

const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  options,
  selectedPlatformId,
  onSelectPlatform,
  disabled = false,
}) => {
  const selectedOption = useMemo(
    () => options.find((option) => option.id === selectedPlatformId),
    [options, selectedPlatformId]
  );

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-800">
            Plateforme de publication
          </p>
          <p className="text-xs text-gray-500">
            Choisissez le réseau social ciblé par ce post
          </p>
        </div>
        {selectedOption && getPlatformIcon(selectedOption.value)}
      </div>

      <select
        className="mt-3 w-full rounded-md border-2 border-gray-200 bg-white p-2 text-sm text-gray-700 focus:border-[#7C3AED] focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
        value={
          selectedPlatformId !== null && selectedPlatformId !== undefined
            ? String(selectedPlatformId)
            : ""
        }
        onChange={(event) => {
          const selectedValue = event.target.value;
          if (!selectedValue) return;
          const platformId = Number(selectedValue);
          if (Number.isNaN(platformId)) {
            return;
          }
          onSelectPlatform(platformId);
        }}
        disabled={disabled || options.length === 0}
      >
        {options.length === 0 ? (
          <option value="" disabled>
            Aucune plateforme connectée
          </option>
        ) : (
          options.map(({ id, value, accountName, isConnected }) => (
            <option key={id} value={String(id)}>
              {getPlatformText(value)}
              {accountName ? ` — ${accountName}` : ""}
              {!isConnected ? " (non connecté)" : ""}
            </option>
          ))
        )}
      </select>

      {selectedOption?.accountName && (
        <p className="mt-2 text-xs text-gray-500">
          Compte connecté : {selectedOption.accountName}
        </p>
      )}
      {!selectedOption?.isConnected && options.length > 0 && (
        <p className="mt-2 text-xs text-amber-600">
          Ce post reste associé à une plateforme qui n'est plus connectée.
        </p>
      )}
    </div>
  );
};

export default PlatformSelector;
