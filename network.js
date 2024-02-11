// the equation for 1 connection is a slope
// weight controlling slope and bais controlling y intercept

// if two sensors connected to same neuron we then have a plane
// w0s0+w1s1+b=0
class NeuralNetwork {
  constructor(neuronCounts) {
    this.levels = [];
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      // Create a new Level with neuronCounts[i] input neurons and neuronCounts[i + 1] output neuron
      this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
    }
  }
  static feedForward(givenInputs, network) {
    if (network.levels) {
      // calling first level to give its output
      let outputs = Level.feedForward(givenInputs, network.levels[0]);
      // for the further levels
      for (let i = 1; i < network.levels.length; i++) {
        // putting the output of prev level as input in the next level
        outputs = Level.feedForward(outputs, network.levels[i]);
      }

      return outputs;
      w;
    }
  }
}
class Level {
  constructor(inputCount, outputCount) {
    // we get the input from  car sensors
    this.inputs = new Array(inputCount);
    this.outputs = new Array(outputCount);
    // each output neuron having a bias
    this.biases = new Array(outputCount);

    this.weights = [];

    for (let i = 0; i < inputCount; i++) {
      // for each input we will have outputCount no of Connection
      this.weights[i] = new Array(outputCount);
    }

    // making a random brain
    Level.#randomize(this);
  }
  // we want to serialize this oject so using static (method dont serialize)
  static #randomize(level) {
    // initializing random weights
    for (let i = 0; i < level.inputs.length; i++) {
      for (let j = 0; j < level.outputs.length; j++) {
        // value between 0 and 1
        level.weights[i][j] = Math.random() * 2 - 1;
      }
    }

    // initializing random baises
    for (let i = 0; i < level.biases.length; i++) {
      level.biases[i] = Math.random() * 2 - 1;
    }
  }
  // computing Output value using feedForward algorithm
  static feedForward(givenInputs, level) {
    // going through all neurons in the current layer
    for (let i = 0; i < level.inputs.length; i++) {
      //assiging value to all neurons in the current layer
      level.inputs[i] = givenInputs[i];
    }

    //to decide the value of output layer
    for (let i = 0; i < level.outputs.length; i++) {
      let sum = 0;
      for (let j = 0; j < level.inputs.length; j++) {
        // taking product of the value of neuron and the weight associated with it
        sum += level.inputs[j] * level.weights[j][i];
      }
      // if its greater than the bias associated with the value of output layer
      if (sum > level.biases[i]) {
        // turn on the neuron
        level.outputs[i] = 1;
      } else {
        // keep it off
        level.outputs[i] = 0;
      }
    }

    return level.outputs;
  }
}
