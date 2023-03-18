import json
from dao.redis_dao import RedisDao
import traceback


class SmallMemory:
    '''
    SmallMemory - available during jobset execution - intended to be used inside node functions
    '''
    tracing_key = 'ALL_MEMORY_KEYS'
    def add_to_tracing_list(self, memory_key):
        RedisDao.get_instance().add_to_set(self.tracing_key, memory_key)

    def clear_memory(self):
        all_traced_keys = RedisDao.get_instance().get_set_list(self.tracing_key)
        try:
            for key in all_traced_keys:
                RedisDao.get_instance().delete_redis_object(key)
            RedisDao.get_instance().delete_redis_object(self.tracing_key)
        except Exception:
            print(Exception, traceback.format_exc())
            pass

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
        self.add_to_tracing_list(memory_key)

    def read_object(self, job_id, key):
        '''
        Reads object stored in internal DB by the given key. The memory is job specific.
        '''
        memory_key = F'{job_id}-{key}'
        value_type_key = f"{memory_key}_value_type_key"
        meta_data = RedisDao.get_instance().get_redis_obj(value_type_key)
        meta_type = meta_data.get('type')
        match meta_type:
            case 'string':
                return RedisDao.get_instance().get_str(memory_key)
            case 'dict':
                return RedisDao.get_instance().get_redis_obj(memory_key)
            case 'np_array':
                return RedisDao.get_instance().get_np_array(memory_key, meta_data)
            case 'pd_dframe':
                return RedisDao.get_instance().get_pd_dataframe(memory_key)
            case _:
                return {}

    def delete_object(self, job_id, key):
        '''
        Removes object stored in internal DB by the given key. The memory is job specific.
        '''
        memory_key = F'{job_id}-{key}'
        return RedisDao.get_instance().delete_redis_object(memory_key)