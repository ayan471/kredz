


const ApiWork = async(props:any) => {

    const req = await fetch('https://geranosgetaways.com/wp-json/wp/v2/hero-slider?acf_format=standard&_fields=id,title,acf');
    const data = await req.json();
    props.setStatetest(data); 

  return (
    <>
    </>
    )
}

export default ApiWork