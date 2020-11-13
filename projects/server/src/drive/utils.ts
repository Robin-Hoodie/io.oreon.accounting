import { FolderPrefix } from "./types";

export const DEFAULT_REGION = "europe-west2";
export const USER_ROBIN_EMAIL = "robin@oreon.io";
export const DOMAIN_OREON = "oreon.io";

export const EXPRESS_YEAR_REGEX = "20\\d{2}"
export const EXPRESS_QUARTER_REGEX = "Q[1-4]"

export const buildYearRoute = (folderPrefix: FolderPrefix, withRouteParam = false): string => {
  const yearsRoute = `${folderPrefix}/years`;
  if (withRouteParam) {
    return `${yearsRoute}/:year(${EXPRESS_YEAR_REGEX})`
  }
  return yearsRoute;
}

export const buildQuarterRoute = (folderPrefix: FolderPrefix, withRouteParam = false): string => {
  const quarterRoute = `${buildYearRoute(folderPrefix, true)}/quarters`;
  if (withRouteParam) {
    return `${quarterRoute}/:quarter(${EXPRESS_QUARTER_REGEX})`;
  }
  return quarterRoute;
}

export const buildInvoiceRoute = (folderPrefix: FolderPrefix, withRouteParam = false): string => {
  const invoiceRoute = `${buildQuarterRoute(folderPrefix, true)}/invoices`;
  if (withRouteParam) {
    return `${invoiceRoute}/:invoiceId`;
  }
  return invoiceRoute;
}
