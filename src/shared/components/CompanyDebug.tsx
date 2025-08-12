import React from "react";
import { useApp } from "../contexts/AppContext";

const CompanyDebug: React.FC = () => {
  const { state, setCurrentCompany, clearCurrentCompany } = useApp();

  const mockCompany = {
    id: "test-company",
    name: "Test Company",
    email: "test@company.com",
    isActive: true,
    color: "bg-green-500",
  };

  return (
    <div className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-50">
      <h3 className="font-bold text-sm mb-2">Debug: Company Context</h3>
      <div className="text-xs space-y-1">
        <div>
          <strong>Current Company:</strong>{" "}
          {state.currentCompany ? (
            <span className="text-green-600">
              {state.currentCompany.name} (ID: {state.currentCompany.id})
            </span>
          ) : (
            <span className="text-red-600">Aucune</span>
          )}
        </div>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => setCurrentCompany(mockCompany)}
            className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
          >
            Set Test Company
          </button>
          <button
            onClick={clearCurrentCompany}
            className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyDebug;
