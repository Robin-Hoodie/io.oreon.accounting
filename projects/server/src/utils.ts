import { Company, FolderPrefix } from "./types";

export const USER_ROBIN_EMAIL = "robin@oreon.io";
export const DOMAIN_OREON = "oreon.io";

export const EXPRESS_YEAR_REGEX = "20\\d{2}"
export const EXPRESS_QUARTER_REGEX = "Q[1-4]"

const NETLIFY_BASE_URL = "/.netlify/functions"

const companyPrefix = (company: Company) => {
  if (company === "OREON") {
    return "oreon";
  }
  if (company === "OREON_IT_CONSULTING") {
    return "oreon-it-consulting"
  }
  throw new Error(`Company ${company} is unknown`);
}

export const buildYearRoute = (company: Company, folderPrefix: FolderPrefix, withRouteParam = false): string => {
  const yearsRoute = `${NETLIFY_BASE_URL}/${companyPrefix(company)}/${folderPrefix}/years`;
  if (withRouteParam) {
    return `${yearsRoute}/:year(${EXPRESS_YEAR_REGEX})`
  }
  return yearsRoute;
}

export const buildQuarterRoute = (company: Company, folderPrefix: FolderPrefix, withRouteParam = false): string => {
  const quarterRoute = `${buildYearRoute(company, folderPrefix, true)}/quarters`;
  if (withRouteParam) {
    return `${quarterRoute}/:quarter(${EXPRESS_QUARTER_REGEX})`;
  }
  return quarterRoute;
}

export const buildInvoiceRoute = (company: Company, folderPrefix: FolderPrefix, withRouteParam = false): string => {
  const invoiceRoute = `${buildQuarterRoute(company, folderPrefix, true)}/invoices`;
  if (withRouteParam) {
    return `${invoiceRoute}/:invoiceId`;
  }
  return invoiceRoute;
}

export const buildUtilsRoute = (suffix: string): string => `${NETLIFY_BASE_URL}/utils/${suffix}`;
