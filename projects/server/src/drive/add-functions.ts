import { postFunction } from "./utils";

export const addQuarterForYear = postFunction(async (request, response) => {
  const { quarter, year } = request.body;
  // Check if quarter and year are valid
});
