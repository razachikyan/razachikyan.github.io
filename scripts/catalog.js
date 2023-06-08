const radioForm = document.getElementById("radio-form");
const checkboxForm = document.getElementById("checkbox-form");

export function CheckboxForm() {
  if (checkboxForm) {
    const labels = Array.from(checkboxForm.querySelectorAll("label"));
    labels.forEach((label) => {
      label.addEventListener("click", () => {
        let className = "custom__checkbox-checked";
        label.querySelector("input").checked = Boolean(
          !label.querySelector("input").checked
        );
        label.querySelector(".custom__checkbox").classList.contains(className)
          ? label.querySelector(".custom__checkbox").classList.add(className)
          : label
              .querySelector(".custom__checkbox")
              .classList.remove(className);
      });
    });
  } else {
    return null;
  }
}

export function RadioInput() {
  if (radioForm) {
    const labels = Array.from(radioForm.querySelectorAll("label"));
    Array.from(labels).forEach((label, i) => {
      label.addEventListener("click", () => {
        debugger;
        labels.map((item, ind) => {
          if (ind === i) {
            item.querySelector("input").checked = true;
            item
              .querySelector(".custom__radio")
              .classList.add("custom__radio-selected");
          } else {
            item.querySelector("input").checked = false;
            if (
              item
                .querySelector(".custom__radio")
                .classList.contains("custom__radio-selected")
            )
              item
                .querySelector(".custom__radio")
                .classList.remove("custom__radio-selected");
          }
        });
      });
    });
  } else {
    return null;
  }
}

export function createPagination(count) {
  const pagination = document.getElementById("pagination");
  if (!pagination) return null;
  const prev = document.createElement("div");
  prev.classList.add("pagination__item");
  prev.textContent = "<";
  pagination.append(prev);
  if (count <= 7) {
    for (let i = 1; i <= count; ++i) {
      const item = document.createElement("div");
      item.classList.add("pagination__item");
      if (i === 3) {
        item.classList.add("pagination__item-selected");
      }
      item.textContent = i;
      pagination.append(item);
    }
  } else {
    for (let i = 1; i <= 7; ++i) {
      const item = document.createElement("div");
      item.classList.add("pagination__item");
      if (i === 3) {
        item.classList.add("pagination__item-selected");
      }
      item.textContent = i;
      pagination.append(item);
    }
    const addition = document.createElement("div");
    addition.classList.add("pagination__item");
    addition.textContent = "...";
    pagination.append(addition);
    const last = document.createElement("div");
    last.classList.add("pagination__item");
    last.textContent = count;
    pagination.append(last);
  }
  const next = document.createElement("div");
  next.classList.add("pagination__item");
  next.textContent = ">";
  pagination.append(next);
}
