/**
 * @module file-hierarchy
 */
/**
 */

// import needed modules

import { AbstractNode } from 'js-hierarchy'
import * as fs from 'fs'
import { FileNodeType } from './FileNodeType'
import { ScanOptionsInterface } from './ScanOptionsInterface'
import * as path from 'path'
import * as minimatch from 'minimatch'
import Bluebird = require('bluebird')

/**
 * file-hierarchy - Turn an entire directory tree into a js-hierarchy node
 */

export class FileNode extends AbstractNode {

  private _path: string
  private _type: FileNodeType
  private _stats: fs.Stats

  public getChildren (): FileNode[] {
    return (
      super.getChildren() as Array<FileNode>
    )
  }

  /**
   * Scan a directory tree and generate a node from it and its
   * children
   *
   * @param {ScanOptionsInterface} options Options for the scan
   * @param {boolean} rootNode Are we in the root node? (used by recursive scans)
   * @return {Bluebird<FileNode>} the generated node
   */
  public scan (
    options: ScanOptionsInterface,
    rootNode: boolean = true
  ): Bluebird<FileNode> {
    this._path = path.resolve(options.path)
    this.name = path.basename(this._path)
    this._type = FileNodeType.Directory
    this._log.trace(`Scanning ${this._path}`)
    return Bluebird.fromCallback(
      fs.stat.bind(this, this._path)
    )
      .then(
        stats => {
          this._stats = stats
          if (
            rootNode ||
            (
              this._stats.isDirectory() && options.recursive
            )
          ) {
            this._log.trace('Scanning directory contents')
            return Bluebird.fromCallback(
              fs.readdir.bind(this, this._path)
            )
              .then(
                (entries: Array<string>) => {
                  return Bluebird.reduce<string, Array<FileNode>>(
                    entries.sort().filter(
                      entry => {
                        return minimatch(
                          entry,
                          options.glob,
                          {
                            dot: true
                          }
                        )
                      }
                    ),
                    (total, entry) => {
                      options.path = path.join(this._path, entry)
                      return options.filter(this._path, entry)
                        .then(
                          result => {
                            if (result) {
                              return new FileNode().scan(options, false)
                            } else {
                              return Bluebird.resolve(null)
                            }
                          }
                        )
                        .then(
                          (node) => {
                            if (node) {
                              total.push(node)
                            }
                            return Bluebird.resolve(total)
                          }
                        )
                    },
                    []
                  )
                    .then(
                      nodes => {
                        for (let node of nodes) {
                          this.addChild(node)
                        }
                        return Bluebird.resolve(this)
                      }
                    )
                }
              )
          } else {
            return Bluebird.resolve(this)
          }
        }
      )

  }

  /**
   * The path to this node
   * @return {string}
   */
  get path (): string {
    return this._path
  }

  set path (value: string
  ) {
    this._path = value
  }

  /**
   * Type of the current node
   * @return {FileNodeType}
   */
  get type (): FileNodeType {
    return this._type
  }

  set type (value: FileNodeType
  ) {
    this._type = value
  }

  /**
   * The fs.Stats object assigned to this node
   * @return {"fs".Stats}
   */
  get stats (): fs.Stats {
    return this._stats
  }

  set stats (value: fs.Stats
  ) {
    this._stats = value
  }
}
