import { ApolloServer, gql } from "apollo-server-lambda";
import { initialize } from "./index";
import { CloudStorage } from "./storage";
import { Quarter } from "./types";

initialize();

const cloudStorage = new CloudStorage("OREON_IT_CONSULTING", "INVOICES_INCOMING");

interface SignedUrlPayload {
  year: string;
  quarter: Quarter;
  filename: string;
}

const typeDefs = gql`
    type Query {
        signedUrlForUpload(year: String!, quarter: String!, filename: String!): String
    }
`;

const resolvers = {
  Query: {
    signedUrlForUpload: async (parent: any, { year, quarter, filename }: SignedUrlPayload) => {
      return await cloudStorage.getSignedUrl(year, quarter, filename);
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

export const handler = server.createHandler({
  cors: {
    origin: "http://localhost:8081"
  }
});
