# Flojoy / Python 

The Python repo for Flojoy infrastructure. Including the client for Flojoy's desktop app, the `@flojoy` decorator, and various utilities for node creation.

## The `@flojoy` decorator

### Usage:

```python
from scipy import signal
import numpy as np
from flojoy import flojoy, DataContainer

@flojoy
def BUTTER(v, params):
    ''' Apply a butterworth filter to an input vector '''

    logger.debug('Butterworth inputs:', v)

    x = v[0].x
    sig = v[0].y
    
    sos = signal.butter(10, 15, 'hp', fs=1000, output='sos')
    filtered = signal.sosfilt(sig, sig)

    return DataContainer(x = x, y = filtered)
```

The `@flojoy` decorator automatically injects vector(s) passed from the previous node, as well as any control parameters set in the CTRL panel UI.

Please see https://github.com/flojoy-io/flojoy-desktop/tree/main/PYTHON/FUNCTIONS for more usage examples.

### Supported data types

See https://github.com/flojoy-io/flojoy-python/issues/4


## Reconcilers

Flojoy nodes should try to accomodate any reasonable combination of inputs that a first-time Flojoy Studio user might try.

For example, the ADD node should make a best effort to do something reasonable when a matrix is added to a DataFrame, or a 2 matrices of a different size are added.

For this reason, we've created the `Reconciler` class to handle the process of turning different data types into compatible, easily added objects. 

### An Example

Here's an example of the Reconciler in action from the ADD node. Just initialize the Reconciler and pass it pairs of primitives from within your DataContainers.

```python
def ADD(dc_inputs: list[DataContainer], params: dict) -> DataContainer:
  ...
    
    dc_reconciler = Reconciler()
    cur_sum = dc_inputs[0]
    for operand_n in dc_inputs[1:]:
        # reconcile the types of the inputs before calling numpy
        reconciled_lhs, reconciled_rhs = dc_reconciler.reconcile(cur_sum.y, operand_n.y)
        cur_sum = np.add(reconciled_lhs, reconciled_rhs)
    return DataContainer(x=dc_inputs[0].x, y=cur_sum)
```

## Customizing your Reconcilers for different Node Categories

Have a different idea about how you want your DataContainers to be interoperable? Subclass `Reconciler` and override the specific type pairs you're interested in.

For example, let's say we're writing image processing nodes, and we want special behavior when dealing with certain image-like DataContainers.


```python
class ImageProcessingReconciler(Reconciler):
    def __init__():
        super().__init__()
    # override only for the pair of types you're interested in! 
    def image__image(self, lhs, rhs):
      # special handling for reconciling two different images
      ... 
      return reconciled_lhs, reconciled_rhs
    def grayscale__image(self, lhs, rhs):
      # special handling for reconciling a grayscale and an image
      ... 
      return reconciled_lhs, reconciled_rhs
```


## Publish Package on PYPI

### Uploading file via *Twine*
You have to install `twine` package first if not installed already.
To install `twine` run following command: 
  `pip install twine`
  
- Update version in [setup.py](setup.py#L5). For example: `version = '0.0.1'` for prod version and `version = '0.0.1-dev'` for dev version release,
- Run following command to make a distribution file:
  `python3 setup.py sdist`
- To upload files on `PYPI`, run following command: 
`twine upload dist/*`

**Note:** You'll need `username` and `password` to make a release. Please get in touch with the team for credentials.