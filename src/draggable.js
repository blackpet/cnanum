import { Sortable, Droppable } from '@shopify/draggable';

const droppable = new Droppable(document.querySelectorAll('.container2'), {
  draggable: '.item',
  dropzone: '.dropzone2'
});

droppable.on('droppable:dropped', () => console.log('droppable:dropped'));
droppable.on('droppable:returned', () => console.log('droppable:returned'));




const sortable = new Sortable(document.querySelectorAll('.sortable'), {
  draggable: '.draggable',
  mirror: {
    constrainDimensions: true
  }
});

sortable.on('drag:start', (e) => {
  console.log('drag:start', e);
});
sortable.on('drag:stop', (e) => {
  console.log('drag:stop', e.source.parentNode.parentNode.dataset, e);
});
sortable.on('sortable:sort', (e) => {
  console.log('sortable:sort', e);
});
sortable.on('sortable:sorted', (e) => {
  console.log('sortable:sorted', e);
});
