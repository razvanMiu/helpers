const images = [
  "https://prod.admin.idralliance.global/download/file/2e10af1d-9d1b-4357-a8ba-c210ad54e4f7?filename=AR.svg&changed=1715767961000",
  "https://prod.admin.idralliance.global/download/file/52a5fbcb-f9aa-4428-a0de-2c9cb71d6d05?filename=AU.svg&changed=1715767961000",
  "https://prod.admin.idralliance.global/download/file/bd9e89bf-2626-4330-a11a-1cbd4732dd09?filename=BE.svg&changed=1715767961000",
  "https://prod.admin.idralliance.global/download/file/46042575-068f-4012-a88f-167ab0177573?filename=BR.svg&changed=1715767961000",
  "https://prod.admin.idralliance.global/download/file/7a98e3d3-47f6-4698-bb73-319bc36935a0?filename=CL.svg&changed=1715767961000",
  "https://prod.admin.idralliance.global/download/file/5e1b8e03-b444-4407-aa8a-fba6faf2195a?filename=CN.svg&changed=1715767961000",
  "https://prod.admin.idralliance.global/download/file/d67ec5a2-9d7b-49d1-8276-29f4539305d4?filename=CO.svg&changed=1715767961000",
  "https://prod.admin.idralliance.global/download/file/255580e6-5eab-4a4f-a077-86e7cf34374a?filename=KM.svg&changed=1715767961000",
  "https://prod.admin.idralliance.global/download/file/32a37d18-1719-4c7b-bb81-1a686530d889?filename=CR.svg&changed=1715767961000",
  "https://prod.admin.idralliance.global/download/file/3d3ce0dc-d159-45e9-9775-713254d68a13?filename=CI.svg&changed=1715767961000",
  "https://prod.admin.idralliance.global/download/file/22c3f41b-04a8-4ad3-b5ad-fa2daa36df0b?filename=DO.svg&changed=1715767961000",
  "https://prod.admin.idralliance.global/download/file/93812a45-001a-40d1-a65b-889cb74ab394?filename=EG.svg&changed=1715767961000",
  "https://prod.admin.idralliance.global/download/file/a0089050-eebd-4f50-85d5-addbdf765282?filename=EU.svg&changed=1715767961000",
  "https://prod.admin.idralliance.global/download/file/d181f6b4-004e-4f7e-b4d1-276fa4e6ea99?filename=FR.svg&changed=1715767961000",
  "https://prod.admin.idralliance.global/download/file/64b1c31c-b541-458e-b6b1-28d77dc6d3aa?filename=DE.svg&changed=1715767961000",
  "https://prod.admin.idralliance.global/download/file/2b288337-1dc9-4397-9edc-c37c1fd4d019?filename=GH.svg&changed=1715767961000",
  "https://prod.admin.idralliance.global/download/file/c60d6609-7e51-4669-916c-0d47a303ca0c?filename=HN.svg&changed=1715767961000",
  "https://prod.admin.idralliance.global/download/file/641adc75-91aa-4859-97c2-95d4d28d4dbc?filename=IT.svg&changed=1715767961000",
  "https://prod.admin.idralliance.global/download/file/7d35ae49-57ce-41cd-827c-ca50e32f9509?filename=JO.svg&changed=1715767961000",
  "https://prod.admin.idralliance.global/download/file/a59797d7-3e14-4a0d-87da-0398795b6d32?filename=KE.svg&changed=1715767961000",
  "https://prod.admin.idralliance.global/download/file/0c4ce31f-96a7-462b-977c-e239426e1661?filename=MR.svg&changed=1715767961000",
  "https://prod.admin.idralliance.global/download/file/f77c2f09-3134-42e5-a860-0f086314c2b7?filename=MX.svg&changed=1715767961000",
  "https://prod.admin.idralliance.global/download/file/e16cdf1a-b87f-4402-9455-2fdf14a39b1b?filename=MN.svg&changed=1715767961000",
  "https://prod.admin.idralliance.global/download/file/88316d34-beb7-474b-a8e4-36c97879f370?filename=MA.svg&changed=1715767961000",
  "https://prod.admin.idralliance.global/download/file/95083465-21b3-4730-9592-0c583f6aee00?filename=NA.svg&changed=1715767961000",
  "https://prod.admin.idralliance.global/download/file/cdec7d07-3e4f-4c79-a55e-581116199527?filename=PA.svg&changed=1715767961000",
  "https://prod.admin.idralliance.global/download/file/34581467-18a3-43b1-8fc2-3fdef05734c7?filename=PT.svg&changed=1715767961000",
  "https://prod.admin.idralliance.global/download/file/f807accb-66f2-4905-9ce4-0d81fa1f9796?filename=SA.svg&changed=1715767961000",
  "https://prod.admin.idralliance.global/download/file/252e4d68-0185-46e2-93ce-4f2b850ccda4?filename=SN.svg&changed=1715767961000",
  "https://prod.admin.idralliance.global/download/file/c97043b2-2a55-4f30-b5f8-1572e7162897?filename=SK.svg&changed=1715767961000",
  "https://prod.admin.idralliance.global/download/file/5d90f5de-974f-418d-b7e4-6273034c894e?filename=SI.svg&changed=1715767961000",
  "https://prod.admin.idralliance.global/download/file/69e63669-175f-4e0c-95e7-8af482c5cc76?filename=SO.svg&changed=1715767961000",
  "https://prod.admin.idralliance.global/download/file/883cb52a-8aba-42f2-bcbc-527706a7a848?filename=ES.svg&changed=1715767961000",
  "https://prod.admin.idralliance.global/download/file/c50fc7bf-12fc-4543-9bc5-14819e2011c4?filename=TN.svg&changed=1715767961000",
  "https://prod.admin.idralliance.global/download/file/d3cfd87a-cab7-4a99-8261-39cf9d577cf3?filename=AE.svg&changed=1715767961000",
  "https://prod.admin.idralliance.global/download/file/ded55782-33b5-42dd-baff-494563685894?filename=US.svg&changed=1715767961000",
  "https://prod.admin.idralliance.global/download/file/696b5621-6fb6-48d9-a0f7-44224d67b76f?filename=UY.svg&changed=1715767961000",
  "https://prod.admin.idralliance.global/download/file/aea5c1cd-d581-4018-8174-320e3b0d2977?filename=UZ.svg&changed=1715767961000",
  "https://prod.admin.idralliance.global/download/file/94f27705-d10c-40af-9f76-4f283a80ea47?filename=logo-adb%201.png&changed=1715333247000",
  "https://prod.admin.idralliance.global/download/file/91085c85-4d25-4aa0-a0ce-b89ffd9d19f8?filename=afpat%201.png&changed=1715333975000",
  "https://prod.admin.idralliance.global/download/file/a638286e-bff9-4353-a86e-aa5b09bd153f?filename=logo-uncbd.png&changed=1715334130000",
  "https://prod.admin.idralliance.global/download/file/5595c2dd-b58f-4587-9ddc-1ff9eb10c3a0?filename=CAF%20-%20Development%20Bank%20of%20Latin%20America.png&changed=1715333741000",
  "https://prod.admin.idralliance.global/download/file/aa575886-18be-477e-a7c0-3c429f0881e0?filename=logo-ebrd%201.png&changed=1715334502000",
  "https://prod.admin.idralliance.global/download/file/a490e2d3-0f65-420c-977d-87c2b0f6c52f?filename=logo-fao%201.png&changed=1715334553000",
  "https://prod.admin.idralliance.global/download/file/67cc67b5-1c42-4520-bc0f-9a60cf659ec9?filename=logo-gwp.png&changed=1715334811000",
  "https://prod.admin.idralliance.global/download/file/7f92bf98-98e8-42d6-9c6d-52e9629fe606?filename=logo-gcf%201.png&changed=1715334900000",
  "https://prod.admin.idralliance.global/download/file/36a818d0-5413-4486-8e25-72f3eb569c54?filename=logo-idb%201.png&changed=1715335124000",
  "https://prod.admin.idralliance.global/download/file/156760fb-afe6-44a5-abff-bbe42e3af8e7?filename=logo-ifad%201.png&changed=1715335213000",
  "https://prod.admin.idralliance.global/download/file/a9c45170-4789-45ca-b777-d1ca0c667bbf?filename=logo-iucn%201.png&changed=1715335264000",
  "https://prod.admin.idralliance.global/download/file/03b776f3-07e8-46a1-aa5e-b79a9f435543?filename=logo-iwmi%201.png&changed=1715335648000",
  "https://prod.admin.idralliance.global/download/file/2dedd174-38bc-4a6f-b7f7-765d172cab38?filename=CILSS%20-%20Permanent%20Interstate%20Committee%20for%20drought%20control%20in%20the%20Sahel.png&changed=1715333847000",
  "https://prod.admin.idralliance.global/download/file/0ae33805-b6fa-4bd5-8106-be773081df0a?filename=Group.png&changed=1715338576000",
  "https://prod.admin.idralliance.global/download/file/e9fda9d0-5094-46d7-9ab6-1f060c4d654a?filename=logo-commonwealth%201.png&changed=1715335945000",
  "https://prod.admin.idralliance.global/download/file/1c91e00a-b2bf-44dc-a4c1-6fd5143ad746?filename=logo-ccrs.png&changed=1715338108000",
  "https://prod.admin.idralliance.global/download/file/fb721525-09e2-4f5a-b510-3b6b93a22dca?filename=logo-gef.png&changed=1715335031000",
  "https://prod.admin.idralliance.global/download/file/2578e592-f911-40db-bbf6-2bef4f3a3941?filename=logo-the_nature_conservancy%201.png&changed=1715335725000",
  "https://prod.admin.idralliance.global/download/file/4c96d217-3f8b-45a2-ad89-751b37d39b04?filename=logo-h.png&changed=1715335891000",
  "https://prod.admin.idralliance.global/download/file/afeb9996-237a-4ac5-96c5-09bead021231?filename=logo-umed%201.png&changed=1715336386000",
  "https://prod.admin.idralliance.global/download/file/e8b5094c-d523-42f8-8408-7aba602a84d7?filename=logo-undp%201.png&changed=1715336617000",
  "https://prod.admin.idralliance.global/download/file/d2639289-bf3b-4f00-b027-e56a9ff13dc5?filename=logo-unep%201.png&changed=1715336684000",
  "https://prod.admin.idralliance.global/download/file/e75c11be-6734-4a9f-8a12-049082b9fa6b?filename=logo-unfccc%201.png&changed=1715336812000",
  "https://prod.admin.idralliance.global/download/file/0b3aae42-3265-4cba-b9e7-f95d3ecd4e25?filename=logo-undrr.png&changed=1715336497000",
  "https://prod.admin.idralliance.global/download/file/6ab68b56-e193-4404-b041-c19275a9baf7?filename=logo-unocha%201.png&changed=1715336748000",
  "https://prod.admin.idralliance.global/download/file/49516bda-9a6b-42c1-9ba1-e3a235a815f6?filename=logo-wmo%201.png&changed=1715336879000",
  "https://prod.admin.idralliance.global/download/file/13b0c95f-c1aa-4763-af99-14bedb0296d8?filename=logo-wwf%201.png&changed=1715337749000",
];

images.forEach((image, index) => {
  fetch(image).then((response) => {
    if (!response.ok) {
      console.error(`Image ${index + 1} failed to load.`);
      console.error(response);
    }
  });
});
