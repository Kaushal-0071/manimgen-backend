from manim import *
import numpy as np

class NeuralNetworkAnimation(Scene):
    def construct(self):
        # Define network architecture and initial weights
        layers = [3, 4, 2]
        weights = [np.random.rand(layers[i + 1], layers[i]) for i in range(len(layers) - 1)]
        
        # Define node positions and radii
        node_radius = 0.2
        layer_spacing_x = 3
        layer_spacing_y = 0.8
        node_coords = []

        # Create nodes and positions
        for layer_idx, layer_size in enumerate(layers):
            layer_x = (layer_idx - (len(layers) - 1) / 2) * layer_spacing_x
            layer_coords = []
            for node_idx in range(layer_size):
                node_y = (node_idx - (layer_size - 1) / 2) * layer_spacing_y
                node_coords.append(np.array([layer_x, node_y, 0]))
            node_coords.append(layer_coords)

        circles = []
        for layer_coords in node_coords:
            if type(layer_coords) == list:
                for coord in layer_coords:
                    circles.append(Circle(radius=node_radius).move_to(coord))

        # Create weight lines and add weight labels
        lines = []
        weight_labels = []
        for i in range(len(layers) - 1):
            for j in range(layers[i]):
                for k in range(layers[i+1]):
                    start = node_coords[i][j]
                    end = node_coords[i+1][k]
                    line = Line(start,end)
                    lines.append(line)
                    
                    weight_val = weights[i][k][j]
                    weight_label = DecimalNumber(weight_val, num_decimal_places=2)
                    weight_label.scale(0.6).move_to(line.get_center())
                    weight_labels.append(weight_label)

        # Create activation labels
        activation_labels = VGroup()
        for i, layer_size in enumerate(layers):
                coords = node_coords[i]
                if type(coords) == list:
                    for j in range(layer_size):
                         coord = coords[j]
                         activation_label = DecimalNumber(0,num_decimal_places=2)
                         activation_label.scale(0.6).move_to(coord + DOWN * (node_radius + 0.3))
                         activation_labels.add(activation_label)
        
        
        self.play(Create(VGroup(*circles)),Create(VGroup(*lines)),Write(VGroup(*weight_labels)),Create(activation_labels))
        self.wait(1)

        # Define Input Activation Vector and create animation for input change
        input_activations = np.array([0.5, 0.7, 0.2])

        def update_activations(input_vector):
            activations = [input_vector]
            for i in range(len(layers) - 1):
                z = np.dot(weights[i], activations[i])
                new_activation = 1 / (1 + np.exp(-z))
                activations.append(new_activation)
            
            return activations

        
        for t in range(5):

            new_input = np.random.rand(3)
            
            activations = update_activations(new_input)
           
            new_activation_labels = VGroup()
            
            label_idx = 0
            for layer_idx, layer_size in enumerate(layers):
                if layer_idx == 0:
                    for j in range(layer_size):
                        label = DecimalNumber(activations[layer_idx][j], num_decimal_places=2)
                        label.scale(0.6).move_to(node_coords[layer_idx][j] + DOWN * (node_radius + 0.3))
                        new_activation_labels.add(label)
                        label_idx +=1
                else:
                    for j in range(layer_size):
                        label = DecimalNumber(activations[layer_idx][j], num_decimal_places=2)
                        label.scale(0.6).move_to(node_coords[layer_idx][j] + DOWN * (node_radius + 0.3))
                        new_activation_labels.add(label)
                        label_idx +=1


            self.play(Transform(activation_labels,new_activation_labels))

            self.wait(1)
            
            activation_labels = new_activation_labels

        self.wait(2)