import { useMemo, useState } from "react";
import { countries } from "./data";
import type { CountryRecord, RiskLevel } from "./types";

const riskOrder: RiskLevel[] = ["Low", "Low-Medium", "Medium", "Medium-High", "High"];

function Badge({ value }: { value: string }) {
  const cls =
    value === "Low"
      ? "badge badge-low"
      : value === "Low-Medium"
      ? "badge badge-low-medium"
      : value === "Medium"
      ? "badge badge-medium"
      : value === "Medium-High"
      ? "badge badge-medium-high"
      : value === "High"
      ? "badge badge-high"
      : "badge";

  return <span className={cls}>{value}</span>;
}

function SummaryCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: number;
  subtitle: string;
}) {
  return (
    <div className="card summary-card">
      <div className="summary-title">{title}</div>
      <div className="summary-value">{value}</div>
      <div className="summary-subtitle">{subtitle}</div>
    </div>
  );
}

export default function App() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All");
  const [pspRisk, setPspRisk] = useState("All");
  const [walletRisk, setWalletRisk] = useState("All");
  const [entryModel, setEntryModel] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState<CountryRecord | null>(null);

  const regions = useMemo(
    () => ["All", ...Array.from(new Set(countries.map((c) => c.region))).sort()],
    []
  );

  const entryModels = useMemo(
    () => ["All", ...Array.from(new Set(countries.map((c) => c.recommendedEntryModel))).sort()],
    []
  );

  const filtered = useMemo(() => {
    return countries
      .filter((c) =>
        c.country.toLowerCase().includes(search.trim().toLowerCase())
      )
      .filter((c) => (region === "All" ? true : c.region === region))
      .filter((c) => (pspRisk === "All" ? true : c.pspRisk === pspRisk))
      .filter((c) => (walletRisk === "All" ? true : c.walletRisk === walletRisk))
      .filter((c) =>
        entryModel === "All" ? true : c.recommendedEntryModel === entryModel
      )
      .sort((a, b) => {
        const riskCompare =
          riskOrder.indexOf(b.pspRisk) - riskOrder.indexOf(a.pspRisk);
        if (riskCompare !== 0) return riskCompare;
        return a.country.localeCompare(b.country);
      });
  }, [search, region, pspRisk, walletRisk, entryModel]);

  const lowRiskMarkets = countries.filter((c) => c.pspRisk === "Low").length;
  const mediumRiskMarkets = countries.filter(
    (c) => c.pspRisk === "Medium" || c.pspRisk === "Low-Medium" || c.pspRisk === "Medium-High"
  ).length;
  const highRiskMarkets = countries.filter((c) => c.pspRisk === "High").length;
  const highWalletRiskMarkets = countries.filter((c) => c.walletRisk === "High").length;

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>Global PSP & E-Money Licensing Dashboard</h1>
          <p>
            Internal strategy view for a Singapore-based cross-border processor
          </p>
        </div>
      </header>

      <main className="layout">
        <section className="content">
          <div className="summary-grid">
            <SummaryCard
              title="Low-Risk PSP Markets"
              value={lowRiskMarkets}
              subtitle="Cross-border usually most workable"
            />
            <SummaryCard
              title="Medium / Grey Area Markets"
              value={mediumRiskMarkets}
              subtitle="Registration, structure, or partner model often needed"
            />
            <SummaryCard
              title="High-Risk PSP Markets"
              value={highRiskMarkets}
              subtitle="Local licence or licensed partner usually required"
            />
            <SummaryCard
              title="High-Risk Wallet Markets"
              value={highWalletRiskMarkets}
              subtitle="Wallet/e-money is the most restricted product globally"
            />
          </div>

          <div className="card filters-card">
            <div className="filters-grid">
              <div className="field">
                <label>Search Country</label>
                <input
                  type="text"
                  placeholder="Search country..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="field">
                <label>Region</label>
                <select value={region} onChange={(e) => setRegion(e.target.value)}>
                  {regions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>PSP Risk</label>
                <select value={pspRisk} onChange={(e) => setPspRisk(e.target.value)}>
                  <option value="All">All</option>
                  {riskOrder.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Wallet Risk</label>
                <select value={walletRisk} onChange={(e) => setWalletRisk(e.target.value)}>
                  <option value="All">All</option>
                  {riskOrder.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field field-wide">
                <label>Recommended Entry Model</label>
                <select value={entryModel} onChange={(e) => setEntryModel(e.target.value)}>
                  {entryModels.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="card table-card">
            <div className="table-header">
              <div>
                <h2>Country Risk Table</h2>
                <p>{filtered.length} markets shown</p>
              </div>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Country</th>
                    <th>Region</th>
                    <th>PSP Risk</th>
                    <th>Wallet Risk</th>
                    <th>Cross-Border Processing</th>
                    <th>Recommended Entry Model</th>
                    <th>Strictness</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((country) => (
                    <tr
                      key={country.country}
                      onClick={() => setSelectedCountry(country)}
                      className="clickable-row"
                    >
                      <td className="country-name">{country.country}</td>
                      <td>{country.region}</td>
                      <td>
                        <Badge value={country.pspRisk} />
                      </td>
                      <td>
                        <Badge value={country.walletRisk} />
                      </td>
                      <td>{country.crossBorderProcessing}</td>
                      <td>{country.recommendedEntryModel}</td>
                      <td>{country.strictnessScore}/5</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <aside className={`drawer ${selectedCountry ? "drawer-open" : ""}`}>
          {selectedCountry ? (
            <>
              <div className="drawer-header">
                <div>
                  <div className="drawer-kicker">Country Detail</div>
                  <h2>{selectedCountry.country}</h2>
                </div>
                <button
                  className="close-btn"
                  onClick={() => setSelectedCountry(null)}
                >
                  ×
                </button>
              </div>

              <div className="drawer-body">
                <div className="detail-block">
                  <div className="detail-label">Region</div>
                  <div className="detail-value">{selectedCountry.region}</div>
                </div>

                <div className="detail-block">
                  <div className="detail-label">Regulator</div>
                  <div className="detail-value">{selectedCountry.regulator}</div>
                </div>

                <div className="detail-grid">
                  <div className="mini-card">
                    <div className="mini-label">PSP Risk</div>
                    <Badge value={selectedCountry.pspRisk} />
                  </div>
                  <div className="mini-card">
                    <div className="mini-label">Wallet Risk</div>
                    <Badge value={selectedCountry.walletRisk} />
                  </div>
                  <div className="mini-card">
                    <div className="mini-label">Strictness</div>
                    <div className="mini-value">{selectedCountry.strictnessScore}/5</div>
                  </div>
                </div>

                <div className="detail-block">
                  <div className="detail-label">PSP Licence Required</div>
                  <div className="detail-value">
                    {selectedCountry.pspLicenseRequired}
                  </div>
                </div>

                <div className="detail-block">
                  <div className="detail-label">Cross-Border Processing</div>
                  <div className="detail-value">
                    {selectedCountry.crossBorderProcessing}
                  </div>
                </div>

                <div className="detail-block">
                  <div className="detail-label">Wallet Licence Exists</div>
                  <div className="detail-value">
                    {selectedCountry.walletLicenseExists}
                  </div>
                </div>

                <div className="detail-block">
                  <div className="detail-label">Wallet Licence Type</div>
                  <div className="detail-value">
                    {selectedCountry.walletLicenseType}
                  </div>
                </div>

                <div className="detail-block">
                  <div className="detail-label">Foreign Wallet Allowed</div>
                  <div className="detail-value">
                    {selectedCountry.foreignWalletAllowed}
                  </div>
                </div>

                <div className="detail-block">
                  <div className="detail-label">Recommended Entry Model</div>
                  <div className="detail-value emphasis">
                    {selectedCountry.recommendedEntryModel}
                  </div>
                </div>

                <div className="detail-block">
                  <div className="detail-label">Notes</div>
                  <div className="detail-value">{selectedCountry.notes}</div>
                </div>
              </div>
            </>
          ) : (
            <div className="drawer-empty">
              <h2>Market Detail</h2>
              <p>Click any country row to view the full regulatory summary.</p>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
