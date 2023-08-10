def cast(type,val):return val
def get_origin(type):0
def get_args(type):return()
def no_type_check(arg):return arg
def overload(func):0
class _AnyCall:
	def __init__(*A,**B):0
	def __call__(*A,**B):0
_anyCall=_AnyCall()
class _SubscriptableType:
	def __getitem__(A,arg):return _anyCall
_Subscriptable=_SubscriptableType()
def TypeVar(type,*A):0
def NewType(name,type):return type
class Any:0
class BinaryIO:0
class ClassVar:0
class Final:0
class Hashable:0
class IO:0
class NoReturn:0
class Sized:0
class SupportsInt:0
class SupportsFloat:0
class SupportsComplex:0
class SupportsBytes:0
class SupportsIndex:0
class SupportsAbs:0
class SupportsRound:0
class TextIO:0
AnyStr=str
Text=str
Pattern=str
Match=str
TypedDict=dict
AbstractSet=_Subscriptable
AsyncContextManager=_Subscriptable
AsyncGenerator=_Subscriptable
AsyncIterable=_Subscriptable
AsyncIterator=_Subscriptable
Awaitable=_Subscriptable
Callable=_Subscriptable
ChainMap=_Subscriptable
Collection=_Subscriptable
Container=_Subscriptable
ContextManager=_Subscriptable
Coroutine=_Subscriptable
Counter=_Subscriptable
DefaultDict=_Subscriptable
Deque=_Subscriptable
Dict=_Subscriptable
FrozenSet=_Subscriptable
Generator=_Subscriptable
Generic=_Subscriptable
Iterable=_Subscriptable
Iterator=_Subscriptable
List=_Subscriptable
Literal=_Subscriptable
Mapping=_Subscriptable
MutableMapping=_Subscriptable
MutableSequence=_Subscriptable
MutableSet=_Subscriptable
NamedTuple=_Subscriptable
Optional=_Subscriptable
OrderedDict=_Subscriptable
Sequence=_Subscriptable
Set=_Subscriptable
Tuple=_Subscriptable
Type=_Subscriptable
Union=_Subscriptable
TYPE_CHECKING=False