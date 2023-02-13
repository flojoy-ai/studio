import json
from dao.redis_dao import RedisDao


class SmallMemory:
    '''
    SmallMemory - available during jobset execution - intended to be used inside node functions
    '''

    def write_object(self, job_id, key, obj):
        '''
        Stores object in internal DB.
        The memory will be available for the duration the jobset is running.
        It overwrites existing memory.

        Currently it's not thread safe.
        '''

        # for thread safety, we'll have to implement Global Locking feature of Redis
        memory_key = F'{job_id}-{key}'
        RedisDao.get_instance().set_redis_obj(memory_key, obj)

    def read_object(self, job_id, key):
        '''
        Reads object stored in internal DB by the given key. The memory is job specific.
        '''
        memory_key = F'{job_id}-{key}'
        obj = RedisDao.get_instance().get_redis_obj(memory_key)
        return obj

    def remove_object(self, job_id, key):
        '''
        Removes object stored in internal DB by the given key. The memory is job specific.
        '''
        memory_key = F'{job_id}-{key}'
        return RedisDao.get_instance().delete_redis_object(memory_key)