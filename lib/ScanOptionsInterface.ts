/**
 * @module file-hierarchy
 */
/**
 */
import Bluebird = require('bluebird')

/**
 * Options for the scan process
 */
export interface ScanOptionsInterface {
  /**
   * The path to search in
   */
  path: string

  /**
   * Iterate through child directories
   */
  recursive: boolean

  /**
   * A glob, that directory entries have to match to be included
   */
  glob: string

  /**
   * A filter function, that is run with every entry and should return wether
   * to include this entry or not
   * @param {string} path Path of entry
   * @param {string} entry Entry to filter
   * @return {Bluebird<boolean>}
   */
  filter: (path: string, entry: string) => Bluebird<boolean>

}
