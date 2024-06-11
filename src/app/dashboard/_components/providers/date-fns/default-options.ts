import { setDefaultOptions as setDefaultOptionsDateFns } from "date-fns";
import { ru } from "date-fns/locale";
import { Settings } from "luxon";

const setDefaultOptions = () => {
  setDefaultOptionsDateFns({ locale: ru });
  Settings.defaultLocale = "ru";
};

export default setDefaultOptions;
