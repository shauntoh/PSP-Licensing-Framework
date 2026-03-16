export type RiskLevel =
  | "Low"
  | "Medium"
  | "High"
  | "Low-Medium"
  | "Medium-High";

export interface CountryRecord {
  country: string;
  region: string;
  regulator: string;
  pspLicenseRequired: string;
  crossBorderProcessing: string;
  pspRisk: RiskLevel;
  walletLicenseExists: string;
  walletLicenseType: string;
  foreignWalletAllowed: string;
  walletRisk: RiskLevel;
  recommendedEntryModel: string;
  strictnessScore: number;
  notes: string;
}
