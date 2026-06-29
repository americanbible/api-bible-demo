import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "apiBibleDemoCache",
  isDefault: true,
});
