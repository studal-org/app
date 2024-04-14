import { setDefaultOptions as setDefaultOptionsDateFns } from "date-fns";
import { ru } from "date-fns/locale";

const setDefaultOptions = () => {
  setDefaultOptionsDateFns({ locale: ru });
};

export default setDefaultOptions;
