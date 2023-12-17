import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchGallery } from './js/pixabay-api';
import { createMarkup } from './js/create-markup';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
});

form.addEventListener('submit', onSubmit);
// btnLoadMore.addEventListener('click', onLoadMore);

async function onSubmit(evt) {
  evt.preventDefault();
  gallery.innerHTML = '';

  const { searchQuery } = evt.currentTarget.elements;
  const searchPhoto = searchQuery.value.toLowerCase().trim();

  try {
    const data = await fetchGallery(searchPhoto);
    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));
      lightbox.refresh();
    }
  } catch (error) {
    console.log(error.message);
  }
}
