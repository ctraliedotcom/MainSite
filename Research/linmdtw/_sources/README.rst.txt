.. role:: raw-html-m2r(raw)
   :format: html



.. image:: https://api.travis-ci.org/ctralie/linmdtw.svg?branch=master
   :target: https://api.travis-ci.org/ctralie/linmdtw
   :alt: Build Status


.. image:: https://codecov.io/gh/ctralie/linmdtw/branch/master/graph/badge.svg
   :target: https://codecov.io/gh/ctralie/linmdtw
   :alt: codecov


Parallelizable Dynamic Time Warping with Linear Memory
======================================================

This repository contains an implementation of the linear memory, parallelizable algorithm for Dynamic Time Warping (DTW) described in [1], which we refer to as ``linmdtw'' for short.  This algorithm can be used to align multivarite time series that are re-parameterized version of each other, such as audio of different orchestral performances.  Please refer to the notebooks for examples.

This repository also contains efficient cython implementations of FastDTW [2], Memory-Restricted Multiscale DTW (MrMsDtw) [3], and globally constrained DTW with a Sakoe-Chiba band (so-called "cdtw").  Please refer to the examples for usage.

For simplicity of implementation, we have restricted our focus to multivariate time series in Euclidean spaces, but pull requests are welcome!  

Installation
------------

To get started, simply type

.. code-block:: bash

   pip install linmdtw

Alternatively, you can checkout this repository and run

.. code-block:: bash

   pip install -r requirements.txt
   python setup.py install

Audio Utilities
^^^^^^^^^^^^^^^

By default, it only install requirements needed to align general Euclidean time series.  To use the audio features and audio stretching utilities, you must also install the audio requirements

.. code-block:: bash

   git clone https://github.com/ctralie/linmdtw.git
   cd linmdtw
   pip install -r requirements.txt
   python setup.py install

GPU Acceleration
^^^^^^^^^^^^^^^^

This library falls back to a CPU implementation when a GPU is not available, but it is not recommended.  If you have a CUDA-capable GPU on your computer, you should install an appropriate version of pycuda by running

.. code-block:: bash

   pip install -r requirements_gpu.txt

Notebooks
^^^^^^^^^

Once you've finished the installation, check out the notebooks/ directory for example usage!


How To Cite
-----------

If you use this software package in any of your work, please cite

.. code-block:: bash

   @inproceedings{tralie2020linmdtw,
     title={Parallelizable Dynamic Time Warping Alignment withLinear Memory},
     author={Tralie, Christopher and Dempsey, Elizabeth},
     booktitle={Proc. of the Int. Soc. for Music Information Retrieval Conf. (ISMIR), in print},
     year={2020}
   }

References
----------

[1] ``\ :raw-html-m2r:`<a href = "http://www.ctralie.com/Research/linmdtw/paper.pdf">Exact, Parallelizable Dynamic Time Warping Alignment with Linear Memory</a>`\ '' by :raw-html-m2r:`<a href = "http://www.ctralie.com">Christopher Tralie</a>` and Elizabeth Dempsey.

[2] Stan Salvador and Phillip Chan. Fastdtw: Toward accurate dynamic time warping in linear time andspace.Proc. of ACM Knowledge Data And Discovery (KDD), 3rd Wkshp. on Mining Temporal andSequential Data, 2004.

[3] Thomas Prätzlich, Jonathan Driedger, and Meinard Müller. Memory-restricted multiscale dynamic timewarping. InProc. of the IEEE Int. Conf. on Acoustics, Speech and Signal Processing (ICASSP), pages569–573. IEEE, 2016.
