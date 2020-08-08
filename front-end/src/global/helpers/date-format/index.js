export function dateFormat(value, dates) {
  let newValue = "";
  let newCarotRange = 0;

  if (value === "") {
    return [newValue, newCarotRange];
  }

  let i = 0;
  let shouldContinue = true;
  if (value.length < dates.length) {
    i++;
  }

  while (i <= value.length && shouldContinue) {
    if (value[i] !== dates[i]) {
      newCarotRange = i + 1;
      shouldContinue = false;
    }
    i++;
  }

  for (let i = 0; i < value.length; i++) {
    if (value[i].match(/^[0-9]$/)) {
      newValue += value[i];
    }
  }

  if (!newValue) {
    return [false, false];
  }

  if (newValue.length > 0) {
    if (newValue[0] > 1) {
      newValue = "0" + newValue;
      newCarotRange++;
    }
  }

  if (newValue.length > 1) {
    if (newValue[0] === "0" && newValue[1] === "0") {
      newValue = "0";
      newCarotRange = 1;
      return [newValue, newCarotRange];
    }

    if (newValue[0] + newValue[1] > 12) {
      newValue = "0" + newValue;
      newCarotRange++;
    }

    newValue = `${newValue[0] || ""}${newValue[1] || ""} / ${
      newValue[2] || ""
    }${newValue[3] || ""}`;
  }

  if (newCarotRange === 2 || newCarotRange === 3) {
    newCarotRange += 3;
  }

  return [newValue, newCarotRange];
}
