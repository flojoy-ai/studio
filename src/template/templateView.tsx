import { useTemplateEffects } from "./templateEffects";
import { useTemplateState } from "./templateState";
import { SubView1 } from "./views/subView1";
import { SubView2 } from "./views/subView2";


export function TemplateView () {
    const {
        propertyA,
        result,
        setPropertyA
    } = useTemplateState();

    useTemplateEffects();
    
    return (
        <>
            <SubView1 property={propertyA} onSetProperty={setPropertyA}/>
            <SubView2 result={result}/>
        </>
    )
}