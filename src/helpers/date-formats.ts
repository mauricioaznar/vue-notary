import moment from "moment";

export const dateFormat = "YYYY-MM-DD";
export const timeFormat = "HH:mm";
export const dateTimeFormat = `${dateFormat} ${timeFormat}`;
export const datePickerDateFormat = "YYYY-MM-DD";
export const timePickerTimeFormat = "HH:mm";

export const formatDate = (date: string) => {
  return moment(date, dateFormat).isValid()
    ? moment(date, dateFormat).format("dddd, MMMM Do YYYY")
    : "-";
};

export const formatDateTime = (date: string) => {
  return moment(date, dateTimeFormat).isValid()
    ? moment(date, dateTimeFormat).format("dddd, MMMM Do YYYY HH:mm")
    : "-";
};

export const formatTime = (datetime: string) => {
  return moment(datetime, dateTimeFormat).isValid()
    ? moment(datetime, dateTimeFormat).format("HH:mm")
    : "-";
};

export const getCurrentMonth = () => {
  return moment().format("M");
};

export const getCurrentYear = () => {
  return moment().format("YYYY");
};

export const getAfterOrBefore = (date: string) => {
  const dateMoment = moment(date, dateFormat);
  return moment().isBefore(dateMoment)
    ? moment().to(dateMoment)
    : dateMoment.from(moment());
};

export const getDaysSubNow = (date: string) => {
  const dateMoment = moment(date, dateFormat);
  return dateMoment.diff(moment(), "days");
};

const startYear = 2000;
export const years = Array.from(
  Array(moment().add(1, "year").year() - startYear + 1)
)
  .map((_, index) => index + startYear)
  .reverse();
