from redis import Redis
from rq import Queue
from rq.job import Job

from GENERATORS import *
from TRANSFORMERS import *
from VISORS import *

from GENERATORS import thing  

import time

conn = Redis()

q = Queue('high', connection=conn)

func = getattr(globals()['LINSPACE'], 'LINSPACE')

def report_success(job, connection, result, *args, **kwargs):
    print('success', result)

def report_failure(job, connection, type, value, traceback):
    print('failure')
    print(job, connection, type, value, traceback)

print(thing)

job = q.enqueue(thing.thing)

print(job.result)   # => None

# Now, wait a while, until the worker is finished
time.sleep(2)
print(job.result)
