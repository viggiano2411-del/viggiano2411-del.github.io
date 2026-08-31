const CONFIG = {
  email: "luigi.viggiano@hotmail.it",
  phone: "+39 348 268 1688",
  whatsapp_message: "Ciao Luigi, vorrei parlarti di un progetto!"
};

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".dynamic-email").forEach(el => {
    if (el.tagName === "A") {
      el.href = `mailto:${CONFIG.email}`;
    }
    // Only replace text content if we are not injecting into an element that has icons.
    // In our case we just want to update the text node without destroying the <i> icon.
    // Let's do it safely:
    const icon = el.querySelector('i');
    if (icon) {
      el.innerHTML = '';
      el.appendChild(icon);
      el.appendChild(document.createTextNode(' ' + CONFIG.email));
    } else {
      el.textContent = CONFIG.email;
    }
  });

  document.querySelectorAll(".dynamic-phone").forEach(el => {
    if (el.tagName === "A") {
      el.href = `tel:${CONFIG.phone.replace(/\\s+/g, '')}`;
    }
    const icon = el.querySelector('i');
    if (icon) {
      el.innerHTML = '';
      el.appendChild(icon);
      el.appendChild(document.createTextNode(' ' + CONFIG.phone));
    } else {
      el.textContent = CONFIG.phone;
    }
  });
});
