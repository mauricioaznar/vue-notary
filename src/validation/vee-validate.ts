import { extend, localize } from "vee-validate";
import * as rules from 'vee-validate/dist/rules';
import es from 'vee-validate/dist/locale/es.json';
import moment from 'moment'
import {timeFormat} from '@/helpers/dateFormats'


for (const [rule, validation] of Object.entries(rules)) {
    extend(rule, {
        ...validation
    });
}

extend('after', {
    params: ['target'],
    validate(value, record) {
        const endTime = moment(value, timeFormat)
        const startTime = moment((record as {target: string}).target, timeFormat)
        if (!startTime.isValid() || !endTime.isValid()) {
            return false
        }
        return startTime.valueOf() < endTime.valueOf();
    },
    message: 'El campo {_field_} debe de estar despues del campo {target}'
});

localize('es', es)

