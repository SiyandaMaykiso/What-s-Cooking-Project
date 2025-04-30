// Fetch and display recipes
function searchIngred(foodItem) {
  $(".results").empty();
  const queryURL = `https://api.edamam.com/api/recipes/v2?type=public&q=${encodeURIComponent(foodItem)}&app_id=0d9f7dae&app_key=d3398ede5f60b649e69bc8d26a3beab6`;

  fetch(queryURL)
    .then(response => response.json())
    .then(data => {
      const recipesWithImages = data.hits.filter(hit => hit.recipe.image && hit.recipe.image !== "");

      if (recipesWithImages.length === 0) {
        $(".results").html("<p>No recipes with images found. Try different ingredients.</p>");
        return;
      }

      recipesWithImages.forEach(({ recipe }) => publishInfo(recipe.label, recipe.image, recipe.url));
    })
    .catch(err => console.error("Failed to fetch recipes:", err));
}

function publishInfo(title, image, link) {
  const id = title.replace(/\s+/g, '');
  const $card = $('<div>').addClass('recipeCard');

  $('<div>').addClass('recipeTitle')
    .append($('<h5>').text(title).attr('id', `h5${id}`))
    .appendTo($card);

  $('<div>').addClass('thumbnail')
    .append($('<img>').attr({
      src: image,
      class: 'thumbnailImg',
      id: `img${id}`,
      alt: `Image of ${title}`
    }))
    .appendTo($card);

  $('<div>').addClass('recipeLinks')
    .append($('<a>').html("<i class='fab fas fa-carrot'></i>").attr({ href: link, target: '_blank' }))
    .appendTo($card);

  $('.results').append($card);
}

// Ingredient form logic
let btncount = 0;

$('#ingredientForm').submit(function (e) {
  e.preventDefault();
  if (btncount > 1) return;
  btncount++;

  const ingredient = $('#searchBar').val().trim();
  $('#searchBar').val("");
  const newBtn = $('<button>').addClass('abtn').text(ingredient);

  if ($('#ingredient1').length) {
    newBtn.attr('id', 'ingredient2');
    $('.ingredient2').append(newBtn);
    const twoIngreds = $('#ingredient1').text() + ',' + ingredient;
    searchIngred(twoIngreds);
  } else {
    newBtn.attr('id', 'ingredient1');
    $('.ingredient1').append(newBtn);
    searchIngred(ingredient);
  }
});

// Remove ingredient tag and re-search
$(document).on('click', '.abtn', function () {
  btncount--;
  $(this).remove();

  if ($('.abtn').length) {
    searchIngred($('.abtn').text());
  } else {
    $('.results').empty();
  }
});

// Location-based grocery finder
function getCoordintes() {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  navigator.geolocation.getCurrentPosition(
    pos => getCity([pos.coords.latitude, pos.coords.longitude]),
    err => console.warn(`ERROR(${err.code}): ${err.message}`),
    options
  );
}

function getCity([lat, lng]) {
  const xhr = new XMLHttpRequest();
  xhr.open(
    'GET',
    `https://us1.locationiq.com/v1/reverse.php?key=pk.e87a2cda53fae1cd1bea780cbaa3ca5c&lat=${lat}&lon=${lng}&format=json`,
    true
  );

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const res = JSON.parse(xhr.responseText);
      getGrocery(res.lat, res.lon);
    }
  };
  xhr.send();
}

function getGrocery(lat, lon) {
  const mapURL = `https://www.google.com/maps/search/grocery+stores/@${lat},${lon},12z/data=!4m4!2m3!5m1!2e1!6e6`;
  window.open(mapURL, '_blank');
}

$('#findGrocery').click(() => getCoordintes());
