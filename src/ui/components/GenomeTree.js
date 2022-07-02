class GenomeTree {
  constructor(dict) {
    this.nodes = [];
    for (let val of Object.values(dict)) {
      if (typeof val == 'number') {
        this.nodes.push(val);
      } else {
        this.nodes.push(new GenomeTree(val));
      }
    }
  }

  getDepth(depth = 0) {
    for (let node of this.nodes) {
      if (node instanceof GenomeTree) {
        depth = node.getDepth(depth + 1);
      }
    }
    return depth;
  }

  getSize() {
    let size = 0;
    for (let node of this.nodes) {
      if (node instanceof GenomeTree) {
        size += node.getSize();
      } else {
        size += 1;
      }
    }
    return size;
  }
}

export default GenomeTree;
