const API_KEY = "cd4bdcfd2808af98a4feee11386a3010";
const ALBUMS = {
  products: "72177720307996298",
  partners: "72177720307984217",
  stars: "72177720308019708",
};

export async function getImageUrlsFor(album) {
  let albumId = ALBUMS[album];
  if (albumId === undefined) {
    console.error(
      "No associated id in remote server with provided album, please check the name:",
      album
    );
    return [];
  }
  let data = await fetchAlbumImagesData(albumId);
  return getImageUrls(data.photoset.photo);
}

function getImageUrls(photos) {
  let urls = [];
  photos.forEach((photo) => {
    urls.push(
      `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`
    );
  });
  return urls;
}

async function fetchAlbumImagesData(albumId) {
  let data = backupData(); // empty data (backup)
  await fetch(makeAlbumURL(albumId))
    .then((response) => response.json())
    .then((response) => (data = response))
    .catch((error) => {
      console.error(
        "Something went wrong while fetching photos for album:",
        albumId,
        "\n The error is:",
        error
      );
    });
  return data;
}

// for fallback
function backupData() {
  return {
    data: {
      photoset: {
        photo: [],
      },
    },
  };
}

function makeAlbumURL(albumId) {
  return (
    `https://api.flickr.com` +
    `/services/rest/` +
    `?method=flickr.photosets.getPhotos` +
    `&api_key=${API_KEY}` +
    `&photoset_id=${albumId}` +
    `&format=json` +
    `&nojsoncallback=1`
  );
}
