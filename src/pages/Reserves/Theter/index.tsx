import { Trans } from '@lingui/macro'
import { Currency, CurrencyAmount, Token, TradeType } from '@uniswap/sdk-core'
import { Trade as V2Trade } from '@uniswap/v2-sdk'
import { Trade as V3Trade } from '@uniswap/v3-sdk'
import { NetworkAlert } from 'components/NetworkAlert/NetworkAlert'
import { AdvancedSwapDetails } from 'components/swap/AdvancedSwapDetails'
import UnsupportedCurrencyFooter from 'components/swap/UnsupportedCurrencyFooter'
import { MouseoverTooltip, MouseoverTooltipContent } from 'components/Tooltip'
import JSBI from 'jsbi'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowLeft, CheckCircle, HelpCircle, Info } from 'react-feather'
import ReactGA from 'react-ga'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components/macro'
import AddressInputPanel from '../../../components/AddressInputPanel'
import { ButtonConfirmed, ButtonError, ButtonGray, ButtonLight, ButtonPrimary } from '../../../components/Button'
import { GreyCard } from '../../../components/Card'
import { AutoColumn } from '../../../components/Column'
import CurrencyInputPanel from '../../../components/CurrencyInputPanel'
import CurrencyLogo from '../../../components/CurrencyLogo'
import Loader from '../../../components/Loader'
import Row, { AutoRow, RowFixed } from '../../../components/Row'
import BetterTradeLink from '../../../components/swap/BetterTradeLink'
import confirmPriceImpactWithoutFee from '../../../components/swap/confirmPriceImpactWithoutFee'
import ConfirmSwapModal from '../../../components/swap/ConfirmSwapModal'
import { ArrowWrapper, Dots, SwapCallbackError, Wrapper } from '../../../components/swap/styleds'
import SwapHeader from '../../../components/swap/SwapHeader'
import TradePrice from '../../../components/swap/TradePrice'
import { SwitchLocaleLink } from '../../../components/SwitchLocaleLink'
import TokenWarningModal from '../../../components/TokenWarningModal'
import { useAllTokens, useCurrency } from '../../../hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTrade } from '../../../hooks/useApproveCallback'
import { V3TradeState } from '../../../hooks/useBestV3Trade'
import useENSAddress from '../../../hooks/useENSAddress'
import { useERC20PermitFromTrade, UseERC20PermitState } from '../../../hooks/useERC20Permit'
import useIsArgentWallet from '../../../hooks/useIsArgentWallet'
import { useIsSwapUnsupported } from '../../../hooks/useIsSwapUnsupported'
import { useSwapCallback } from '../../../hooks/useSwapCallback'
import useToggledVersion, { Version } from '../../../hooks/useToggledVersion'
import { useUSDCValue } from '../../../hooks/useUSDCPrice'
import useWrapCallback, { WrapType } from '../../../hooks/useWrapCallback'
import { useActiveWeb3React } from '../../../hooks/web3'
import { useWalletModalToggle } from '../../../state/application/hooks'
import { Field } from '../../../state/swap/actions'
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from '../../../state/swap/hooks'
import { useExpertModeManager, useUserSingleHopOnly } from '../../../state/user/hooks'
import { HideSmall, LinkStyledButton, TYPE } from '../../../theme'
import { computeFiatValuePriceImpact } from '../../../utils/computeFiatValuePriceImpact'
import { getTradeVersion } from '../../../utils/getTradeVersion'
import { isTradeBetter } from '../../../utils/isTradeBetter'
import { maxAmountSpend } from '../../../utils/maxAmountSpend'
import { warningSeverity } from '../../../utils/prices'
import AppBody from '../../AppBody'
import SimpleReactLightbox, { SRLWrapper, useLightbox } from 'simple-react-lightbox'

const StyledInfo = styled(Info)`
  opacity: 0.4;
  color: ${({ theme }) => theme.text1};
  height: 16px;
  width: 16px;
  :hover {
    opacity: 0.8;
  }
`
const Container = styled.div.attrs((props) => ({
  className: 'container',
}))`
  color: ${({ theme }) => theme.text1};
`
const InfoTextPrimary = styled.span`
  color: ${({ theme }) => theme.text1};
`
const InfoTextSecondary = styled.p`
  color: ${({ theme }) => theme.text2};
`
const PackageTitle = styled.p`
  padding: 1rem;
  color: ${({ theme }) => theme.text1};
`
const Price = styled.span`
  font-size: 30px;
  font-weight: 600;
  color: ${({ theme }) => theme.blue5};
`
const TextLeft = styled.div`
  display: flex !important;
  padding-left: 13px;
  font-size: 16px;
  font-weight: 400;
  line-height: 28px;
  margin: 0px;
  text-align: left !important;
  color: ${({ theme }) => theme.text2};
`
const TextRight = styled.div`
  text-align: right !important;
  padding-right: 1rem !important;
  color: ${({ theme }) => theme.text1};
`
const Pricing = styled.div.attrs((props) => ({
  className: 'single-pricing active mt-30',
}))`
  background: ${({ theme }) => theme.bg0};
  border: solid 0.25px ${({ theme }) => theme.text4};
`
const CardH3 = styled.h5`
  color: ${({ theme }) => theme.text2};
`
const CardSpan = styled.span`
  color: ${({ theme }) => theme.text3};
`

const AchievementsCard = styled.div.attrs((props) => ({
  className: 'col-lg-6 card',
}))`
  background: ${({ theme }) => theme.bg0};
  color: ${({ theme }) => theme.blue5};
  :hover {
    transform: scale(1.02);
    transition: 0.5s;
    background-color: #fff;
    box-shadow: 0px 5px 50px -8px #ddd;
  }
`
export default function Theter({ history }: RouteComponentProps) {
  const { account } = useActiveWeb3React()
  const loadedUrlParams = useDefaultsFromURLSearch()

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ]
  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false)
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c?.isToken ?? false) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  )
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
  }, [])

  // dismiss warning if all imported tokens are in active lists
  const defaultTokens = useAllTokens()
  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !Boolean(token.address in defaultTokens)
    })

  const theme = useContext(ThemeContext)

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  // for expert mode
  const [isExpertMode] = useExpertModeManager()

  // get version from the url
  const toggledVersion = useToggledVersion()

  // swap state
  const { independentField, typedValue, recipient } = useSwapState()
  const {
    v2Trade,
    v3TradeState: { trade: v3Trade, state: v3TradeState },
    toggledTrade: trade,
    allowedSlippage,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
  } = useDerivedSwapInfo(toggledVersion)

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const { address: recipientAddress } = useENSAddress(recipient)

  const parsedAmounts = useMemo(
    () =>
      showWrap
        ? {
            [Field.INPUT]: parsedAmount,
            [Field.OUTPUT]: parsedAmount,
          }
        : {
            [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
            [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
          },
    [independentField, parsedAmount, showWrap, trade]
  )

  const fiatValueInput = useUSDCValue(parsedAmounts[Field.INPUT])
  const fiatValueOutput = useUSDCValue(parsedAmounts[Field.OUTPUT])
  const priceImpact = computeFiatValuePriceImpact(fiatValueInput, fiatValueOutput)

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput]
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput]
  )

  // reset if they close warning without tokens in params
  const handleDismissTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
    history.push('/swap/')
  }, [history])

  // modal and loading
  const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    showConfirm: boolean
    tradeToConfirm: V2Trade<Currency, Currency, TradeType> | V3Trade<Currency, Currency, TradeType> | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  )
  const routeNotFound = !trade?.route
  const isLoadingRoute = toggledVersion === Version.v3 && V3TradeState.LOADING === v3TradeState

  // check whether the user has approved the router on the input token
  const [approvalState, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage)
  const {
    state: signatureState,
    signatureData,
    gatherPermitSignature,
  } = useERC20PermitFromTrade(trade, allowedSlippage)

  const handleApprove = useCallback(async () => {
    if (signatureState === UseERC20PermitState.NOT_SIGNED && gatherPermitSignature) {
      try {
        await gatherPermitSignature()
      } catch (error) {
        // try to approve if gatherPermitSignature failed for any reason other than the user rejecting it
        if (error?.code !== 4001) {
          await approveCallback()
        }
      }
    } else {
      await approveCallback()
    }
  }, [approveCallback, gatherPermitSignature, signatureState])

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approvalState === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approvalState, approvalSubmitted])

  const maxInputAmount: CurrencyAmount<Currency> | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const showMaxButton = Boolean(maxInputAmount?.greaterThan(0) && !parsedAmounts[Field.INPUT]?.equalTo(maxInputAmount))

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade,
    allowedSlippage,
    recipient,
    signatureData
  )

  const [singleHopOnly] = useUserSingleHopOnly()

  const handleSwap = useCallback(() => {
    if (!swapCallback) {
      return
    }
    if (priceImpact && !confirmPriceImpactWithoutFee(priceImpact)) {
      return
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: undefined })
    swapCallback()
      .then((hash) => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: hash })
        ReactGA.event({
          category: 'Swap',
          action:
            recipient === null
              ? 'Swap w/o Send'
              : (recipientAddress ?? recipient) === account
              ? 'Swap w/o Send + recipient'
              : 'Swap w/ Send',
          label: [
            trade?.inputAmount?.currency?.symbol,
            trade?.outputAmount?.currency?.symbol,
            getTradeVersion(trade),
            singleHopOnly ? 'SH' : 'MH',
          ].join('/'),
        })
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        })
      })
  }, [
    swapCallback,
    priceImpact,
    tradeToConfirm,
    showConfirm,
    recipient,
    recipientAddress,
    account,
    trade,
    singleHopOnly,
  ])

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false)

  // warnings on the greater of fiat value price impact and execution price impact
  const priceImpactSeverity = useMemo(() => {
    const executionPriceImpact = trade?.priceImpact
    return warningSeverity(
      executionPriceImpact && priceImpact
        ? executionPriceImpact.greaterThan(priceImpact)
          ? executionPriceImpact
          : priceImpact
        : executionPriceImpact ?? priceImpact
    )
  }, [priceImpact, trade])

  const isArgentWallet = useIsArgentWallet()

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !isArgentWallet &&
    !swapInputError &&
    (approvalState === ApprovalState.NOT_APPROVED ||
      approvalState === ApprovalState.PENDING ||
      (approvalSubmitted && approvalState === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ showConfirm: false, tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn, showConfirm })
  }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash])

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency)
    },
    [onCurrencySelection]
  )

  const handleMaxInput = useCallback(() => {
    maxInputAmount && onUserInput(Field.INPUT, maxInputAmount.toExact())
  }, [maxInputAmount, onUserInput])

  const handleOutputSelect = useCallback(
    (outputCurrency) => onCurrencySelection(Field.OUTPUT, outputCurrency),
    [onCurrencySelection]
  )

  const swapIsUnsupported = useIsSwapUnsupported(currencies?.INPUT, currencies?.OUTPUT)

  const priceImpactTooHigh = priceImpactSeverity > 3 && !isExpertMode
  const elements = [
    {
      src: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=967&q=80',
      caption: 'Lorem ipsum dolor sit amet',
      height: 'auto',
    },
    {
      src: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      caption: 'Lorem ipsum dolor sit amet',
      height: 'auto',
    },
    {
      src: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1053&q=80',
      caption: 'Lorem ipsum dolor sit amet',
      height: 'auto',
    },
    {
      src: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
      caption: 'Lorem ipsum dolor sit amet',
      height: 'auto',
    },
  ]
  function MyComponent() {
    const { openLightbox } = useLightbox()
    return (
      <div className="col-lg-5 px-0">
        <ButtonPrimary onClick={() => openLightbox()}>Lorem ipsum</ButtonPrimary>
        <SRLWrapper elements={elements} />
      </div>
    )
  }

  const [showDeposit, setShowDepostit] = useState(false)
  const [showInvestOverview, setShowInvestOverview] = useState(false)
  function Invest() {
    return (
      <Container>
        <div className="row">
          <div className="col">
            <button className="btn btn-light" onClick={() => setShowDepostit(!showDeposit)}>
              back
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <form className="basic-form">
              <div className="caption">
                <h6>How much would you like to deposit?</h6>
                <p>
                  Please enter an amount you would like to deposit. The maximum amount you can deposit is shown below.
                </p>
              </div>
              <div className="basic-form-inner mb-3">
                <div className="amount-field-inner">
                  <div className="row-amount-field">
                    <div className="row-title-inner">
                      <div className="row-title">Available to deposit</div>
                    </div>
                    <div className="row-content">
                      <div className="content-value">
                        <div className="content-value-line">
                          <p className="value">
                            $500
                            <span className="symbol">DAY</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="amount-field">
                    <div className="token-icon">
                      <img
                        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MCA1MCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iLjUiIHgyPSIuNSIgeTE9IjEuMTQyIiB5Mj0iLS4xMDUiIGdyYWRpZW50VW5pdHM9Im9iamVjdEJvdW5kaW5nQm94Ij48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmOWE2MDYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmYmNjNWYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48Y2lyY2xlIGN4PSIyNSIgY3k9IjI1IiByPSIyNSIgZmlsbD0idXJsKCNhKSIgZGF0YS1uYW1lPSJFbGxpcHNlIDEyNzEiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMzkuODI1IDIwLjg3NWgtMi45NjdjLTEuNjMzLTQuNTMzLTYuMDI1LTcuNjQyLTExLjgxNy03LjY0MmgtOS41MjV2Ny42NDJoLTMuMzA4djIuNzQyaDMuMzA4djIuODc1aC0zLjMwOHYyLjc0MWgzLjMwOHY3LjU1aDkuNTI1YzUuNzI1IDAgMTAuMDgzLTMuMDgzIDExLjc1OC03LjU1aDMuMDI1di0yLjc0MmgtMi4zNThhMTIuNDMzIDEyLjQzMyAwIDAwLjA5Mi0xLjQ4M3YtLjA2N2MwLS40NS0uMDI1LS44OTItLjA2Ny0xLjMyNWgyLjM0MnYtMi43NDJ6bS0yMS42NDItNS4yaDYuODU4YzQuMjUgMCA3LjQwOCAyLjA5MiA4Ljg2NyA1LjE5MkgxOC4xODN6bTYuODU4IDE4LjY0MmgtNi44NTh2LTUuMDkyaDE1LjcwOGMtMS40NjYgMy4wNS00LjYxNiA1LjA5MS04Ljg1IDUuMDkxem05Ljc1OC05LjI1YTkuODU5IDkuODU5IDAgMDEtLjEgMS40MTdIMTguMTgzdi0yLjg3NWgxNi41MjVhMTAuODQgMTAuODQgMCAwMS4wOTIgMS4zOTJ6IiBkYXRhLW5hbWU9IlBhdGggNzUzNiIvPjwvc3ZnPg=="
                        width="30"
                        height="30"
                      ></img>
                    </div>
                    <div className="basic-field amount-field-input">
                      <input type="number" placeholder="Amount" />
                    </div>
                    <div className="amount-field-right-inner">
                      <button type="button" className="max-button">
                        Max
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mb-3">
                <button
                  className="btn btn-primary"
                  type="submit"
                  onClick={() => setShowInvestOverview(!showInvestOverview)}
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    )
  }
  function InvestOverview() {
    return (
      <Container>
        <div className="row">
          <div className="col">
            <button className="btn btn-light" onClick={() => setShowInvestOverview(!showInvestOverview)}>
              back
            </button>
          </div>
        </div>
        <div className="confirmation-view">
          <div className="caption">
            <h6>Deposit overview</h6>
            <p>These are your transaction details. Make sure to check if this is correct before submitting.</p>
          </div>
          <div className="confirmation-view-content-inner">
            <div className="conformation-view-content">
              <div className="row-amount-field">
                <div className="row-title-inner">
                  <div className="row-title">Amount</div>
                </div>
                <div className="row-content">
                  <div className="content-value">
                    <div className="content-value-line">
                      <div className="token-icon">
                        <img
                          src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MCA1MCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iLjUiIHgyPSIuNSIgeTE9IjEuMTQyIiB5Mj0iLS4xMDUiIGdyYWRpZW50VW5pdHM9Im9iamVjdEJvdW5kaW5nQm94Ij48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmOWE2MDYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmYmNjNWYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48Y2lyY2xlIGN4PSIyNSIgY3k9IjI1IiByPSIyNSIgZmlsbD0idXJsKCNhKSIgZGF0YS1uYW1lPSJFbGxpcHNlIDEyNzEiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMzkuODI1IDIwLjg3NWgtMi45NjdjLTEuNjMzLTQuNTMzLTYuMDI1LTcuNjQyLTExLjgxNy03LjY0MmgtOS41MjV2Ny42NDJoLTMuMzA4djIuNzQyaDMuMzA4djIuODc1aC0zLjMwOHYyLjc0MWgzLjMwOHY3LjU1aDkuNTI1YzUuNzI1IDAgMTAuMDgzLTMuMDgzIDExLjc1OC03LjU1aDMuMDI1di0yLjc0MmgtMi4zNThhMTIuNDMzIDEyLjQzMyAwIDAwLjA5Mi0xLjQ4M3YtLjA2N2MwLS40NS0uMDI1LS44OTItLjA2Ny0xLjMyNWgyLjM0MnYtMi43NDJ6bS0yMS42NDItNS4yaDYuODU4YzQuMjUgMCA3LjQwOCAyLjA5MiA4Ljg2NyA1LjE5MkgxOC4xODN6bTYuODU4IDE4LjY0MmgtNi44NTh2LTUuMDkyaDE1LjcwOGMtMS40NjYgMy4wNS00LjYxNiA1LjA5MS04Ljg1IDUuMDkxem05Ljc1OC05LjI1YTkuODU5IDkuODU5IDAgMDEtLjEgMS40MTdIMTguMTgzdi0yLjg3NWgxNi41MjVhMTAuODQgMTAuODQgMCAwMS4wOTIgMS4zOTJ6IiBkYXRhLW5hbWU9IlBhdGggNzUzNiIvPjwvc3ZnPg=="
                          width="16"
                          height="16"
                        ></img>
                      </div>
                      <p className="value">
                        $500
                        <span className="symbol">DAY</span>
                      </p>
                    </div>
                    <div className="content-value-subline">
                      <p className="content-subvalue">
                        <span className="usd-symbol">$</span>
                        200
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="conformation-view-actions-inner">
            <div className="actions-wrapper">
              <div className="action-wrapper-buttons">
                <button className="actions-wrapper-button actions-wrapper-button-active" disabled>
                  <span>1</span>
                  <p>Deposit</p>
                </button>
                <button className="actions-wrapper-button" disabled>
                  <span>2</span>
                  <p>Finished</p>
                </button>
              </div>
            </div>
          </div>
          <form className="actions-execute mb-3">
            <div className="txtop-info">
              <div className="txtop-info-inner">
                <div className="txtop-info-left-inner">
                  <div className="txtop-info-title">1/2 Desposit</div>
                  <span>Please submit to deposit</span>
                </div>
                <div className="txtop-info-right-inner">
                  <div className="txtop-info-button-inner">
                    <button className="btn btn-primary" type="submit">
                      Depostit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </Container>
    )
  }
  return (
    <>
      {!showDeposit && !showInvestOverview ? (
        <>
          <section className="reserve">
            <div className="cover">
              <div className="bg-reserve">
                <div className="container content-end">
                  <div className="col-xl-5 col-lg-6">
                    <div className="pb-3">
                      <h4 className="sub-title">Lorem ipsum..</h4>
                      <h3 className="title">Lorem ipsum dolor sit..</h3>
                      <p>Lorem ipsum dolor sit amet..</p>
                      <SimpleReactLightbox>
                        <MyComponent />
                      </SimpleReactLightbox>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="proy-desc" className="proy-desc-area pt-125 pb-130">
            <Container>
              <div className="row">
                <div className="col-lg-8">
                  <Container>
                    <div className="row">
                      <div className="col-12">
                        <div className="proy-desc-content mt-50">
                          <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt
                            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                            laboris nisi ut aliquip ex ea commodo consequat.
                          </p>
                        </div>
                      </div>
                      <div className="col-12 mt-5">
                        <div className="row">
                          <div className="col-lg-6 proy-desc-content mt-50">
                            <ul className="clearfix">
                              <li>
                                <div className="single-info d-flex align-items-center">
                                  <div className="info-icon">
                                    <i className="lni-calendar">*</i>
                                  </div>
                                  <div className="info-text">
                                    <p>
                                      <InfoTextPrimary>lorem ipsum dolor:</InfoTextPrimary>
                                    </p>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div className="single-info d-flex align-items-center">
                                  <div className="info-text">
                                    <InfoTextSecondary>sit amet, consectetur</InfoTextSecondary>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div className="single-info d-flex align-items-center">
                                  <div className="info-icon">
                                    <i className="lni-phone-handset">*</i>
                                  </div>
                                  <div className="info-text">
                                    <p>
                                      <InfoTextPrimary>lorem ipsum dolor:</InfoTextPrimary>
                                    </p>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div className="single-info d-flex align-items-center">
                                  <div className="info-text">
                                    <InfoTextSecondary>sit amet, consectetur</InfoTextSecondary>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div className="single-info d-flex align-items-center">
                                  <div className="info-icon">
                                    <i className="lni-phone-handset">*</i>
                                  </div>
                                  <div className="info-text">
                                    <p>
                                      <InfoTextPrimary>lorem ipsum dolor:</InfoTextPrimary>
                                    </p>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div className="single-info d-flex align-items-center">
                                  <div className="info-text">
                                    <InfoTextSecondary>sit amet, consectetur</InfoTextSecondary>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div className="single-info d-flex align-items-center">
                                  <div className="info-icon">
                                    <i className="lni-map-marker">*</i>
                                  </div>
                                  <div className="info-text">
                                    <p>
                                      <InfoTextPrimary>lorem ipsum dolor:</InfoTextPrimary>
                                    </p>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div className="single-info d-flex align-items-center">
                                  <div className="info-text">
                                    <InfoTextSecondary>sit amet, consectetur</InfoTextSecondary>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          </div>
                          <div className="col-lg-6 proy-desc-content mt-50">
                            <ul className="clearfix">
                              <li>
                                <div className="single-info d-flex align-items-center">
                                  <div className="info-icon">
                                    <i className="lni-calendar">*</i>
                                  </div>
                                  <div className="info-text">
                                    <p>
                                      <InfoTextPrimary>lorem ipsum dolor:</InfoTextPrimary>
                                    </p>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div className="single-info d-flex align-items-center">
                                  <div className="info-text">
                                    <InfoTextSecondary>sit amet, consectetur</InfoTextSecondary>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div className="single-info d-flex align-items-center">
                                  <div className="info-icon">
                                    <i className="lni-phone-handset">*</i>
                                  </div>
                                  <div className="info-text">
                                    <p>
                                      <InfoTextPrimary>lorem ipsum dolor:</InfoTextPrimary>
                                    </p>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div className="single-info d-flex align-items-center">
                                  <div className="info-text">
                                    <InfoTextSecondary>sit amet, consectetur</InfoTextSecondary>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div className="single-info d-flex align-items-center">
                                  <div className="info-icon">
                                    <i className="lni-phone-handset">*</i>
                                  </div>
                                  <div className="info-text">
                                    <p>
                                      <InfoTextPrimary>lorem ipsum dolor:</InfoTextPrimary>
                                    </p>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div className="single-info d-flex align-items-center">
                                  <div className="info-text">
                                    <InfoTextSecondary>sit amet, consectetur</InfoTextSecondary>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div className="single-info d-flex align-items-center">
                                  <div className="info-icon">
                                    <i className="lni-map-marker">*</i>
                                  </div>
                                  <div className="info-text">
                                    <p>
                                      <InfoTextPrimary>lorem ipsum dolor:</InfoTextPrimary>
                                    </p>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div className="single-info d-flex align-items-center">
                                  <div className="info-text">
                                    <InfoTextSecondary>sit amet, consectetur</InfoTextSecondary>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Container>
                </div>
                <div className="col-lg-4">
                  <div className="col-lg-12">
                    <Pricing>
                      <div className="pricing-package text-center">
                        <PackageTitle>
                          Quedan
                          <h6>$2,747,847 MXN</h6>
                          disponibles para invertir
                        </PackageTitle>
                      </div>
                      <div className="pricing-body">
                        <div className="advance px-3 pb-3">
                          <div className="progress">
                            <div
                              className="progress-bar"
                              role="progressbar"
                              aria-valuenow={30}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              style={{ width: '30%' }}
                            ></div>
                          </div>
                        </div>
                        <div className="pricing-text text-center pt-3">
                          <h5>Monto Conseguido</h5>
                          <Price>$8,738,731</Price>
                        </div>
                        <div className="pricing-desc-content">
                          <ul className="clearfix">
                            <li>
                              <div className="single-info d-flex align-items-center">
                                <div className="pricing-text">
                                  <p className="text-center">
                                    <Price>15.86%</Price>
                                    APY
                                  </p>
                                </div>
                              </div>
                            </li>
                            <li>
                              <div className="single-info d-flex align-items-center">
                                <div className="pricing-text">
                                  <p className="text-center">
                                    <Price>A</Price>
                                  </p>
                                  <p className="pl-5">Risk Type</p>
                                </div>
                              </div>
                            </li>
                            <li>
                              <TextLeft>
                                <p>
                                  <span>Lorem ipsum dolor:</span>
                                </p>
                              </TextLeft>
                            </li>
                            <li>
                              <TextRight>
                                <p>$14,500,000</p>
                              </TextRight>
                            </li>
                            <li>
                              <TextLeft>
                                <p>
                                  <span>Minimum Required:</span>
                                </p>
                              </TextLeft>
                            </li>
                            <li>
                              <TextRight>
                                <p>$7,500,000</p>
                              </TextRight>
                            </li>
                            <li>
                              <TextLeft>
                                <p>
                                  <span>Objective:</span>
                                </p>
                              </TextLeft>
                            </li>
                            <li>
                              <TextRight>
                                <p>Income</p>
                              </TextRight>
                            </li>
                            <li>
                              <TextLeft>
                                <p>
                                  <span>Asset Type:</span>
                                </p>
                              </TextLeft>
                            </li>
                            <li>
                              <TextRight>
                                <p>Residence</p>
                              </TextRight>
                            </li>
                          </ul>
                        </div>
                        <div className="text-center">
                          <div className="pricing-btn">
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() => setShowDepostit(!showDeposit)}
                            >
                              invest
                            </button>
                          </div>
                        </div>
                      </div>
                    </Pricing>
                  </div>
                </div>
              </div>
            </Container>
          </section>

          <section className="skills-section pt-5">
            <Container>
              <div className="row">
                <div className="col">
                  <h2 className="section-title">Lorem ipsum</h2>
                  <div className="list-card">
                    <span className="exp">Excepteur sint</span>
                    <div>
                      <CardH3>amet, consectetur adipisicing elit</CardH3>
                      <CardSpan>Ut enim ad minim veniam, …</CardSpan>
                    </div>
                  </div>
                  <div className="list-card">
                    <span className="exp">occaecat cupidatat</span>
                    <div>
                      <CardH3>quis nostrud exercitation</CardH3>
                      <CardSpan>aliquip ex ea commodo consequat.</CardSpan>
                    </div>
                  </div>
                  <div className="list-card">
                    <span className="exp">non proident</span>
                    <div>
                      <CardH3>uries, but also the leap into</CardH3>
                      <CardSpan>It was popularised in the 1960s with the release of Letraset</CardSpan>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <h2 className="section-title">Lorem ipsum</h2>
                  <div className="list-card">
                    <div>
                      <CardH3>Lorem ipsum dolor sit</CardH3>
                      <CardSpan>laboris nisi ut aliquip ex ea commodo consequat.</CardSpan>
                    </div>
                  </div>
                  <div className="list-card">
                    <div>
                      <CardH3>Sed ut perspiciatis</CardH3>
                      <CardSpan>
                        sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                      </CardSpan>
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </section>

          <section className="achievements p-5">
            <div className="container cards">
              <div className="row">
                <AchievementsCard>
                  <div className="skill-level">
                    <span>+</span>
                    <h2>60</h2>
                  </div>
                  <div className="skill-meta">
                    <h3>illo inventore veritatis</h3>
                    <span>
                      et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
                    </span>
                  </div>
                </AchievementsCard>
                <AchievementsCard>
                  <div className="skill-level">
                    <h2>50</h2>
                    <span>%</span>
                  </div>
                  <div className="skill-meta">
                    <h3>dolor sit amet</h3>
                    <span>sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</span>
                  </div>
                </AchievementsCard>
                <AchievementsCard>
                  <div className="skill-level">
                    <h2>30</h2>
                    <span>%</span>
                  </div>
                  <div className="skill-meta">
                    <h3>Quis autem</h3>
                    <span>
                      Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut
                      aliquid ex ea commodi consequatur
                    </span>
                  </div>
                </AchievementsCard>
                <AchievementsCard>
                  <div className="skill-level">
                    <h2>20</h2>
                    <span>%</span>
                  </div>
                  <div className="skill-meta">
                    <h3>At vero eos </h3>
                    <span>
                      vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel
                      illum qui dolorem eum fugiat quo voluptas nulla pariatur
                    </span>
                  </div>
                </AchievementsCard>
              </div>
            </div>
          </section>
        </>
      ) : showDeposit && !showInvestOverview ? (
        <Invest />
      ) : (
        <InvestOverview />
      )}
    </>
  )
}
