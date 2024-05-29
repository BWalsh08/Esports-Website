/**
 * This function will check if a word is valid, that is if it matches any of the
 * words in the dictionary.
 * @param {string} word A string containing lowercase letters, with possible
 * wildcards.
 * @returns {boolean} Returns whether the given word is a valid word.
 */
export function isValid(word) {
    // if the word has no wildcard, then we just check if it is in the dictionary.
    if (!word.includes('*')) {
      // SOLUTION NEW BEGIN
      return window.dictionary && dictionary.includes(word);
      // SOLUTION NEW END
    }
  
    // if it does have one or more wildcard, we replace the first one by every
    // possible character, and recurse.
    for (let i = 0; i < 26; ++i) {
      const letter = String.fromCharCode('a'.charCodeAt(0) + i);
      // replace only replaces the first occurence of *.
      if (isValid(word.replace('*', letter))) {
        return true;
      }
    }
  
    return false;
  }
  