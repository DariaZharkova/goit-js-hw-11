import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchGallery } from './js/pixabay-api';
import { createMarkup } from './js/create-markup';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
});

let page = 1;
let searchPhoto = '';
let totalPages = 0;

loadMore.style.display = 'none';

form.addEventListener('submit', onSubmit);

async function onSubmit(evt) {
  evt.preventDefault();
  page = 1;
  gallery.innerHTML = '';
  loadMore.style.display = 'none';
  const { searchQuery } = evt.currentTarget.elements;
  searchPhoto = searchQuery.value.toLowerCase().trim();
  if (searchPhoto === '') {
    Notiflix.Notify.info('Please, enter parameters for search');
    return;
  }

  try {
    const { hits, totalHits } = await fetchGallery(searchPhoto, page);
    totalPages = Math.ceil(totalHits / 40);

    if (totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      gallery.insertAdjacentHTML('beforeend', createMarkup(hits));
      lightbox.refresh();
      if (page < totalPages) {
        loadMore.style.display = 'block';
      }
    }
  } catch (error) {
    console.log(error.message);
  }

  // evt.currentTarget.reset();
}

loadMore.addEventListener('click', onLoadMore);

async function onLoadMore() {
  page += 1;
  if (page >= totalPages) {
    loadMore.style.display = 'none';
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }

  try {
    const { hits } = await fetchGallery(searchPhoto, page);
    gallery.insertAdjacentHTML('beforeend', createMarkup(hits));
    lightbox.refresh();
  } catch (error) {
    console.log(error.message);
  }
}
