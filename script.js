function searchIngred(foodItem) {
  $(".results").empty();

  const queryURL = `https://api.edamam.com/api/recipes/v2?type=public&q=${encodeURIComponent(foodItem)}&app_id=0d9f7dae&app_key=d3398ede5f60b649e69bc8d26a3beab6`;

  fetch(queryURL)
    .then(response => response.json())
    .then(data => {
      console.log(data);

      data.hits.forEach((hit) => {
        const recipe = hit.recipe;
        publishInfo(recipe.label, recipe.image, recipe.url);
      });
    })
    .catch(err => {
      console.error("Failed to fetch recipes:", err);
    });
}

function publishInfo(recipeTitle, recipeThumb, sourceLink) {
  const cleanId = recipeTitle.replace(/\s+/g, '');

  $("<div>").addClass("recipeTitle").attr("id", `${cleanId}recipeTitle`).appendTo(".results");
  $("<div>").addClass("thumbnail").attr("id", `${cleanId}thumbnail`).appendTo(".results");
  $("<div>").addClass("recipeLinks").attr("id", `${cleanId}recipeLinks`).appendTo(".results");

  innerDivs(recipeTitle, sourceLink);
  innerImg(recipeTitle, recipeThumb);
}

function innerDivs(recipeTitle, sourceLink) {
  const cleanId = recipeTitle.replace(/\s+/g, '');

  if (!$(`#h5${cleanId}`).length) {
    $("<h5>").text(recipeTitle).attr("id", `h5${cleanId}`).appendTo(`#${cleanId}recipeTitle`);
  }

  $("<a>")
    .html("<i class='fab fas fa-carrot'></i>")
    .attr({ href: sourceLink, target: "_blank" })
    .appendTo(`#${cleanId}recipeLinks`);
}

function innerImg(recipeTitle, recipeThumb) {
  const cleanId = recipeTitle.replace(/\s+/g, '');

  if (!$(`#img${cleanId}`).length) {
    $("<img>")
      .attr({
        src: recipeThumb,
        class: "thumbnailImg",
        id: `img${cleanId}`,
        alt: `Image of ${recipeTitle}`
      })
      .appendTo(`#${cleanId}thumbnail`);
  }
}

// ✅ NEWLY ADDED: Form submission logic
let btncount = 0;

$("#ingredientForm").submit(function (e) {
  e.preventDefault(); // Prevents page reload

  if (btncount > 1) return;
  btncount++;

  const ingredient = $("#searchBar").val().trim();
  $("#searchBar").val("");

  const newBtn = $("<button>");

  if ($("#ingredient1").length) {
    newBtn.attr("id", "ingredient2").addClass("abtn").text(ingredient);
    $(".ingredient2").append(newBtn);

    const twoIngreds = $("#ingredient1").text() + "," + ingredient;
    searchIngred(twoIngreds);
    return;
  }

  newBtn.attr("id", "ingredient1").addClass("abtn").text(ingredient);
  $(".ingredient1").append(newBtn);
  searchIngred(ingredient);
});

// ✅ NEWLY ADDED: Remove ingredient button
$(document).on("click", ".abtn", function () {
  btncount--;
  $(this).remove();

  if ($(".abtn").length) {
    const remainingIngredient = $(".abtn").text();
    searchIngred(remainingIngredient);
  } else {
    $(".results").empty();
  }
});

// ✅ Existing grocery location logic (unchanged)
function getCoordintes() {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos) {
    const crd = pos.coords;
    const coordinates = [crd.latitude.toString(), crd.longitude.toString()];
    getCity(coordinates);
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  navigator.geolocation.getCurrentPosition(success, error, options);
}

function getCity(coordinates) {
  const [lat, lng] = coordinates;
  const xhr = new XMLHttpRequest();

  xhr.open(
    "GET",
    `https://us1.locationiq.com/v1/reverse.php?key=pk.e87a2cda53fae1cd1bea780cbaa3ca5c&lat=${lat}&lon=${lng}&format=json`,
    true
  );

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      getGrocery(response.lat, response.lon);
    }
  };

  xhr.send();
}

function getGrocery(latitude, longitude) {
  window.open(
    `https://www.google.com/maps/search/grocery+stores/@${latitude},${longitude},12z/data=!4m4!2m3!5m1!2e1!6e6`,
    "_blank"
  );
}

// ✅ Attach click handler to the grocery button
$("#findGrocery").click(function () {
  getCoordintes();
});