import { extend, localize } from "vee-validate";
import * as rules from "vee-validate/dist/rules";
import es from "vee-validate/dist/locale/en.json";
import moment from "moment";
import { timeFormat } from "@/helpers/date-formats";

import "../views/vee-validate";

for (const [rule, validation] of Object.entries(rules)) {
  extend(rule, {
    ...validation,
  });
}

extend("after", {
  params: ["target"],
  validate(value, record) {
    const endTime = moment(value, timeFormat);
    const startTime = moment((record as { target: string }).target, timeFormat);
    if (!startTime.isValid() || !endTime.isValid()) {
      return false;
    }
    return startTime.valueOf() < endTime.valueOf();
  },
  message: "The field {_field_} must be after the field {target}",
});

localize("es", es);
