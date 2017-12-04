/**
 * @module file-hierarchy
 */
/**
 */
import { ScanOptionsInterface } from './ScanOptionsInterface'
import Bluebird = require('bluebird')

/**
 * An implementation of [[ScanOptionsInterface]]
 */
export class ScanOptions implements ScanOptionsInterface {
  private _path: string
  private _recursive: boolean
  private _glob: string
  private _filter: (path: string, entry: string) => Bluebird<boolean>

  constructor (path?: string) {
    this._filter = (path, entry) => {
      return Bluebird.resolve(true)
    }
    this._glob = '*'
    if (path) {
      this._path = path
    }
    this._recursive = true
  }

  get path (): string {
    return this._path
  }

  set path (value: string) {
    this._path = value
  }

  get recursive (): boolean {
    return this._recursive
  }

  set recursive (value: boolean) {
    this._recursive = value
  }

  get glob (): string {
    return this._glob
  }

  set glob (value: string) {
    this._glob = value
  }

  get filter (): (path: string, entry: string) => Bluebird<boolean> {
    return this._filter
  }

  set filter (value: (path: string, entry: string) => Bluebird<boolean>) {
    this._filter = value
  }
}
