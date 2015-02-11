
'use strict';

/**
 * Store for values
 */

var store  = {};

/**
 * Get value
 * @param  {String} abbr
 * @return {Function}
 * @api private
 */

function get(abbr) {

  if (typeof abbr === 'string' && !store[abbr]) {
    return;
  }

  var word = typeof abbr === 'object' ? abbr : store[abbr];

  return function(num) {

    if (isNaN(parseInt(num))) {
      return;
    }

    return [+num, decline(+num, word)].join(' ');

  };

}

/**
 * Decline value
 * @param  {Number} num
 * @param  {String} word
 * @return {String}
 * @api private
 */

function decline(num, word) {

  num = Math.abs(num);

  // fractional
  if (Math.floor(num) !== num) {
    return word[1];
  }

  // integer
  if (num > 10 && ((num % 100) - ((num % 100) % 10)) / 10 === 1) {
    return word[2];
  } else {
    var nn = num % 10;
    return word[(nn === 0 || nn >= 5) ? 2 : (nn >= 2 ? 1 : 0)];
  }

}

/**
 * Numd
 * @param {Number|String|Object} num
 * @param {String} nominative
 * @param {String} genitiveSingular
 * @param {String} genitivePlural
 * @api public
 */

function numd(num, nominative, genitiveSingular, genitivePlural) {

  if (typeof num === 'object') {

    // set words array
    for (var item in num) {
      if (num[item].length === 3) {
        store[item] = num[item];
        numd[item]  = get(item);
      }
    }

  } else if (typeof num === 'string' && !!genitivePlural) {

    // set one word
    store[num] = [nominative, genitiveSingular, genitivePlural];
    numd[num]  = get(num);

  } else if (arguments.length === 4) {

    // guick get value
    return get([nominative, genitiveSingular, genitivePlural])(num);

  } else if (nominative && store[nominative]) {

    // get from storage
    return get(nominative)(num);

  }

}

/**
 * Module exports
 */

module.exports = numd;