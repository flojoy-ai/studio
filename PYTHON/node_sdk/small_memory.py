import traceback

from dao.redis_dao import RedisDao


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

    def write_to_memory(self, job_id, key, value):
        '''
        Stores object in internal DB.
        The memory will be available for the duration the jobset is running.
        It overwrites existing memory.

        Currently it's not thread safe.
        '''

        # for thread safety, we'll have to implement Global Locking feature of Redis
        memory_key = F'{job_id}-{key}'
        s = str(type(value))
        v_type = s.split("'")[1]
        match v_type:
            case "numpy.ndarray":
                np_memo_key = f"{memory_key}_np_memo_key"
                array_dtype = str(value.dtype)
                memo_key = f'{key}|{array_dtype}'
                for d in value.shape:
                    memo_key += f"#{d}"
                RedisDao.get_instance().set_str(np_memo_key, memo_key)
                self.add_to_tracing_list(np_memo_key)
                RedisDao.get_instance().set_np_array(memo_key, value)
                self.add_to_tracing_list(memo_key)
            case 'pandas.core.frame.DataFrame':
                pd_memo_key = f"{memory_key}_pd_memo_key"
                RedisDao.get_instance().set_str(pd_memo_key, "df_stored")
                self.add_to_tracing_list(pd_memo_key)
                RedisDao.get_instance().set_pandas_dataframe(memory_key, value)
                self.add_to_tracing_list(memory_key)
            case 'str':
                RedisDao.get_instance().set_str(memory_key, value)
                self.add_to_tracing_list(memory_key)
            case 'dict':
                RedisDao.get_instance().set_redis_obj(memory_key, value)
                self.add_to_tracing_list(memory_key)
            case _:
                raise ValueError(
                    f"SmallMemory currently does not support '{v_type}' type data!")

    def read_memory(self, job_id, key):
        '''
        Reads object stored in internal DB by the given key. The memory is job specific.
        '''
        memory_key = F'{job_id}-{key}'
        get_str = RedisDao.get_instance().get_str(memory_key)
        if get_str:
            return get_str
        np_memo_key = RedisDao.get_instance().get_str(
            f"{memory_key}_np_memo_key")
        if np_memo_key:
            np_array = RedisDao.get_instance().get_np_array(np_memo_key)
            return np_array
        pd_memo_key = f"{memory_key}_pd_memo_key"
        if pd_memo_key:
            pd_dframe = RedisDao.get_instance().get_pd_dataframe(memory_key)
            return pd_dframe
        obj = RedisDao.get_instance().get_redis_obj(memory_key)
        return obj

    def delete_object(self, job_id, key):
        '''
        Removes object stored in internal DB by the given key. The memory is job specific.
        '''
        memory_key = F'{job_id}-{key}'
        return RedisDao.get_instance().delete_redis_object(memory_key)
