async function loadData() {
  try {
    const response = await fetch("./airbnb_sf_listings_500.json");
    const data = await response.json();

    const container = document.getElementById("listings");

    data.slice(0, 50).forEach((l) => {
      const div = document.createElement("div");
      div.classList.add("wrapper");

      // Amenities preview (first 5)
      const amenitiesPreview = l.amenities
        ? JSON.parse(l.amenities).slice(0, 5).join(", ") + "..."
        : "No amenities listed";

      // Eco highlight
      let ecoMsg = "";
      if (l.description?.toLowerCase().includes("zero voc")) ecoMsg += "Zero-VOC paint, ";
      if (l.description?.toLowerCase().includes("organic")) ecoMsg += "organic drinks, ";
      if (l.description?.toLowerCase().includes("art")) ecoMsg += "local artwork, ";
      ecoMsg = ecoMsg ? `🌱 Eco-Friendly Stay: ${ecoMsg.replace(/, $/, "")}` : "";

      // Trust score
      const responseRate = parseInt(l.host_response_rate) || 0;
      const acceptanceRate = parseInt(l.host_acceptance_rate) || 0;
      const trustScore = Math.round((responseRate + acceptanceRate) / 2);

      div.innerHTML = `
        <div>
          <h2 class="name">${l.name}</h2>
          <p class="price">${l.price}</p>
          <p class="desc">${l.description || "No description available."}</p>
          <p class="amenities"><strong>Amenities:</strong> ${amenitiesPreview}</p>
          ${
            ecoMsg
              ? `<div class="eco-highlight">${ecoMsg}</div>`
              : ""
          }
        </div>
        <div>
          <p class="host_name">Host: ${l.host_name}</p>
          <div class="host_image">
            <img
              class="host_thumbnail"
              src="${l.host_thumbnail_url}"
              alt="${l.name}"
              width="200"
              style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover;"
            />
            <img
              class="host_pic"
              src="${l.host_picture_url}"
              alt="${l.name}"
              width="200"
              style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover;"
              onload="this.previousElementSibling.style.display='none';"
              onerror="this.style.display='none';"
            />
          </div>
          <div class="trust-meter">
            <div class="meter-bar">
              <div class="meter-fill" style="width:${trustScore}%">${trustScore}%</div>
            </div>
            <p style="font-size:0.9rem; margin-top:5px;">
              ${responseRate}% response · ${acceptanceRate}% acceptance · ${
        l.host_is_superhost === "t" ? "Verified Superhost" : "Regular host"
      }
            </p>
          </div>
        </div>
      `;

      container.appendChild(div);
    });
  } catch (error) {
    console.error("Error loading JSON data:", error);
  }
}

loadData();
