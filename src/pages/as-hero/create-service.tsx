import { Alert, Button, message, Steps } from "antd";
import Layout from "components/common/layout";
import Lottie from "react-lottie";
import React, { useState } from "react";
import { AiFillQuestionCircle } from "react-icons/ai";
import IntroductionForm from "module/create-service/introduction-form";
import ExplainitForm from "module/create-service/explainit-form";
import ConvinceForm from "module/create-service/convince-form";
import AnnounceService from "module/create-service/announce";
import { FDataConvince, FDataExplainIt, FDataIntroduction } from "module/create-service/models";
import { useMutation, useQuery } from "react-query";
import { Service, ServiceData } from "models";
import fileService from "services/file";
import heroService from "services/hero";
import authService from "services/auth";
import { StorageReference } from "firebase/storage";
import JsonAdminAnim from "assets/animation/admin.json";
import { DEFAULT_ERROR } from "utils/constant";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SERVICE_HERO_PATH } from "utils/routes";

const steps = [
    {
        title: "Introduction",
    },
    {
        title: "Explain It",
    },
    {
        title: "Convince",
    },
    {
        title: "Announce",
    },
];

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: JsonAdminAnim,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
    },
};

function CreateService() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editIdService = searchParams.get("edit");
    const user = authService.CurrentUser();

    const [currentStep, setCurrentStep] = useState(0);
    const [introductionData, setIntroductionData] = useState<FDataIntroduction | null>(null);
    const [explainItData, setExplainItData] = useState<FDataExplainIt | null>(null);
    const [convinceData, setConvinceData] = useState<FDataConvince | null>(null);

    const uploadFilesMutation = useMutation(async (data: File[]) => {
        if (!data || data?.length === 0) return [];
        const refs = await fileService.UploadMultipleFile({ files: data });
        return [...refs.map((ref) => ref.ref)];
    });

    const getDownloadUrlsMutation = useMutation(async (data: StorageReference[]) => {
        if (!data || data?.length === 0) return [];
        const urls = await fileService.GetMultipleDownloadUrl({ refs: data });
        return urls;
    });

    const uploadFiles = async ({ images, pdfs }: { images: File[]; pdfs: File[] }) => {
        const imagesUpload = uploadFilesMutation.mutateAsync(images);
        const pdfsUpload = uploadFilesMutation.mutateAsync(pdfs);

        await Promise.all([imagesUpload, pdfsUpload]);
        const imageRefs = (await imagesUpload)?.map((el) => el) || [];
        const pdfRefs = (await pdfsUpload)?.map((el) => el) || [];

        const getImagesUrl = getDownloadUrlsMutation.mutateAsync(imageRefs);
        const getPdfsUrl = getDownloadUrlsMutation.mutateAsync(pdfRefs);

        await Promise.all([getImagesUrl, getPdfsUrl]);

        const imageUrls = await getImagesUrl;
        const pdfUrls = await getPdfsUrl;
        return {
            images: imageUrls,
            pdfs: pdfUrls,
        };
    };

    const createMutation = useMutation(
        async ({ data, status }: { data: Omit<Service, "images" | "pdfs"> & FDataConvince; status: ServiceData["status"] }) => {
            return heroService.ProxyRequest(async () => {
                const { images, pdfs } = await uploadFiles({ images: data.images, pdfs: data.pdfs });
                const addRefsToService: Service = {
                    ...data,
                    images: images || [],
                    pdfs: pdfs || [],
                };
                const idService = await heroService.CreateService({ uid: user?.uid as any, status, service: addRefsToService });
                return idService;
            });
        },
        {
            onSuccess: (idService, { status }) => {
                if (status === "active") {
                    message.success("Your New Service Is On Air!");
                    navigate(`${`${SERVICE_HERO_PATH}/${user?.uid}` as any}/${idService}`);
                    return;
                }
                message.success("successful save draft");
                navigate("/");
            },
            onError: (err: any) => {
                message.error(err?.message || DEFAULT_ERROR);
            },
        }
    );

    const getServiceQuery = useQuery(
        [editIdService],
        async () => {
            const service = await heroService.GetDetailService({ sid: editIdService as any });
            return service;
        },
        {
            enabled: !!editIdService,
            refetchOnWindowFocus: false,
            refetchInterval: false,
            onSuccess: (service) => {
                setIntroductionData({
                    title: service.title,
                    category: service.category,
                    sub_category: service.sub_category,
                    price: service.price,
                    tags: service.tags,
                });
                setExplainItData({
                    description: service.description,
                });
            },
        }
    );

    const onClickGuide = () => {};

    const prevStep = () => {
        window.scrollTo(0, 0);
        setCurrentStep((prev) => prev - 1);
    };

    const nextStep = () => {
        window.scrollTo(0, 0);
        setCurrentStep((prev) => prev + 1);
    };

    const createService = (status: ServiceData["status"]) => {
        if (!introductionData || !explainItData) return;
        const service = {
            id: getServiceQuery.data ? getServiceQuery.data.id : "",
            ...introductionData,
            ...explainItData,
            ...convinceData,
        };
        createMutation.mutate({
            data: service as any,
            status,
        });
    };

    return (
        <Layout loading={getServiceQuery.isLoading}>
            {getServiceQuery.isError && <Alert message={(getServiceQuery.error as any)?.message} type="error" />}
            <div className="w-full">
                <div className="w-full flex items-center justify-between">
                    <div className="flex items-center my-4">
                        <p className="m-0 mr-2 font-semibold text-xl capitalize">create service</p>
                        <AiFillQuestionCircle className="text-gray-400 text-xl cursor-pointer" onClick={onClickGuide} />
                    </div>
                    {currentStep >= 3 && (
                        <Button disabled={createMutation.isLoading} onClick={() => createService("draft")} type="primary">
                            Save as draft
                        </Button>
                    )}
                </div>
                <Steps current={currentStep}>
                    {steps.map((step) => (
                        <Steps.Step title={step.title} />
                    ))}
                </Steps>
                {!createMutation.isLoading && (
                    <div className="mt-10 w-full bg-white rounded-md border-solid border border-gray-300 p-6">
                        {currentStep === 0 && <IntroductionForm currentData={introductionData} onSubmit={setIntroductionData} nextStep={nextStep} />}
                        {currentStep === 1 && (
                            <ExplainitForm currentData={explainItData} onSubmit={setExplainItData} nextStep={nextStep} prevStep={prevStep} />
                        )}
                        {currentStep === 2 && (
                            <ConvinceForm currentData={convinceData} onSubmit={setConvinceData} nextStep={nextStep} prevStep={prevStep} />
                        )}
                        {currentStep === 3 && <AnnounceService onPublish={() => createService("active")} prevStep={prevStep} />}
                    </div>
                )}
                {createMutation.isLoading && (
                    <div className="w-full mt-10 bg-white min-h-[400px] flex items-center justify-center flex-col rounded-md border-solid border border-gray-300 p-6">
                        <Lottie isClickToPauseDisabled options={defaultOptions} height={350} width={350} />
                        <p className="m-0 capitalize text-xl mt-2 text-gray-400 font-medium">wait, creating your service post</p>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default CreateService;
