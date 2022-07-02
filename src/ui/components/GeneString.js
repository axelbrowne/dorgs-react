import './GeneString.css';
import GenomeTree from './GenomeTree.js';
import React, { useRef, useEffect } from 'react';
import { RGB, LinearGradient } from '../../utils/Color.ts';

const genome = {
  a: {
    i: 0.01,
    j: 0.4,
    k: 0.99,
  },
  b: {
    g: 0.2,
  },
  c: 0.1,
};

const GeneString = (props) => {
  const gt = new GenomeTree(genome);
  console.log(gt.getDepth());
  console.log(gt.getSize());

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const grad = new LinearGradient([
      new RGB(0, 0, 110),
      new RGB(240, 0, 0),
      new RGB(255, 250, 110),
    ]);

    const height = canvas.height;
    const geneWidth = canvas.width / gt.getSize();
    let x = 0;

    const drawGene = (node) => {
      // console.log(x, node);
      let color = grad.colorAt(node).saturate();
      ctx.fillStyle = color.toString();
      ctx.fillRect(x, 0, geneWidth, height);
      x += geneWidth;
    };

    const drawTree = (tree) => {
      const treeWidth = geneWidth * tree.getSize();

      for (let node of tree.nodes) {
        if (node instanceof GenomeTree) {
          drawTree(node);
          continue;
        } else {
          drawGene(node);
        }
      }

      ctx.lineWidth = 10;
      ctx.strokeStyle = `rgb(0, 0, ${
        255 * (tree.getDepth() / (gt.getDepth() + 1))
      })`;

      ctx.strokeRect(x + 2, 0 + 2, treeWidth - 4, height - 4);
    };

    drawTree(gt);
  }, []);
  console.log(props);
  return <canvas className="GS-canvas" ref={canvasRef} {...props} />;
};

export default GeneString;
