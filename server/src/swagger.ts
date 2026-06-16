import path from "path";
import swaggerJSDoc from "swagger-jsdoc";

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Presight User Directory API",
      version: "1.0.0",
      description: "Paginated, searchable, filterable user directory API",
    },
    servers: [{ url: "/", description: "Current host" }],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            avatar: { type: "string", format: "uri" },
            first_name: { type: "string", example: "Jane" },
            last_name: { type: "string", example: "Doe" },
            age: { type: "integer", example: 29 },
            nationality: { type: "string", example: "Finland" },
            hobbies: {
              type: "array",
              items: { type: "string" },
              example: ["chess", "hiking"],
            },
          },
        },
        FilterValue: {
          type: "object",
          properties: {
            value: { type: "string", example: "Finland" },
            count: { type: "integer", example: 12 },
          },
        },
        UsersResponse: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/User" },
            },
            total: { type: "integer", example: 500 },
            page: { type: "integer", example: 1 },
            limit: { type: "integer", example: 20 },
            hasMore: { type: "boolean", example: true },
            filters: {
              type: "object",
              properties: {
                hobbies: {
                  type: "array",
                  items: { $ref: "#/components/schemas/FilterValue" },
                },
                nationalities: {
                  type: "array",
                  items: { $ref: "#/components/schemas/FilterValue" },
                },
              },
            },
          },
        },
      },
    },
  },
  // glob treats backslashes as escape chars, so force forward slashes on Windows
  apis: [path.join(__dirname, "routes/*.{ts,js}").split(path.sep).join("/")],
});

export default swaggerSpec;
