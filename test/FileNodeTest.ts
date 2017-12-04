import 'mocha'
import chai = require('chai')
import { FileNode } from '../lib/FileNode'
import chaiAsPromised = require('chai-as-promised')
import * as path from 'path'
import { ScanOptions } from '../lib/ScanOptions'
import Bluebird = require('bluebird')
chai.use(chaiAsPromised)

describe(
  'FileNode', () => {
    describe(
      'scan', () => {
        let scanPath = path.join('test', 'fixtures', 'scan')
        it(
          'should scan a directory correctly', function () {
            return new FileNode().scan(
              new ScanOptions(scanPath)
            )
              .then(
                node => {
                  chai.expect(
                    node.name
                  ).to.equal('scan')
                  chai.expect(
                    node.path
                  ).to.equal(path.resolve(scanPath))
                  chai.expect(
                    node.stats.isDirectory()
                  ).to.equal(true)
                  chai.expect(
                    node.getChildren().length
                  ).to.equal(3)
                  chai.expect(
                    node.getChildren()[0].name
                  ).to.equal('test1.txt')
                  chai.expect(
                    node.getChildren()[1].name
                  ).to.equal('test2.txt')
                  chai.expect(
                    node.getChildren()[2].name
                  ).to.equal('testsub')
                  chai.expect(
                    node.getChildren()[1].stats.size
                  ).to.equal(7)
                  chai.expect(
                    node.getChildren()[2].getChildren().length
                  ).to.equal(2)
                  chai.expect(
                    node.getChildren()[2].getChildren()[0].name
                  ).to.equal('test2.txt')
                  chai.expect(
                    node.getChildren()[2].getChildren()[0].stats.size
                  ).to.equal(0)
                  chai.expect(
                    node.getChildren()[2].getChildren()[1].name
                  ).to.equal('testsub1.txt')
                }
              )
          }
        )
        it(
          'should adhere to the glob pattern', function () {
            let options = new ScanOptions(scanPath)
            options.glob = 'testsub*'
            return new FileNode().scan(
              options
            )
              .then(
                node => {
                  chai.expect(
                    node.getChildren().length
                  ).to.equal(1)
                  chai.expect(
                    node.getChildren()[0].name
                  ).to.equal('testsub')
                  chai.expect(
                    node.getChildren()[0].getChildren().length
                  ).to.equal(1)
                  chai.expect(
                    node.getChildren()[0].getChildren()[0].name
                  ).to.equal('testsub1.txt')
                }
              )
          }
        )
        it(
          'should adhere to the recursive option', function () {
            let options = new ScanOptions(scanPath)
            options.recursive = false
            return new FileNode().scan(
              options
            )
              .then(
                node => {
                  chai.expect(
                    node.getChildren().length
                  ).to.equal(3)
                  chai.expect(
                    node.getChildren()[2].name
                  ).to.equal('testsub')
                  chai.expect(
                    node.getChildren()[2].getChildren().length
                  ).to.equal(0)
                }
              )
          }
        )
        it(
          'should filter entries', function () {
            let options = new ScanOptions(scanPath)
            options.filter = (checkPath, checkEntry) => {
              if (checkEntry === 'testsub') {
                return Bluebird.resolve(false)
              }
              return Bluebird.resolve(true)
            }
            return new FileNode().scan(
              options
            )
              .then(
                node => {
                  chai.expect(
                    node.getChildren().length
                  ).to.equal(2)
                  chai.expect(
                    node.getChildren()[0].name
                  ).to.equal('test1.txt')
                  chai.expect(
                    node.getChildren()[1].name
                  ).to.equal('test2.txt')
                }
              )
          }
        )
      }
    )
  }
)
