!program test
!    real(kind=8):: x_k, y_k, dqx, dqy, delta, theta
!    x_k = 2
!    y_k = -3
!    delta = 0.1  
!    theta = 0.001
!    call graddescent(x_k, y_k, delta, theta)    
!end program test

subroutine graddescent(x_k, y_k, delta, theta)
    real(kind=8), intent(inout):: x_k, y_k, delta, theta
    real(kind=8):: dqx, dqy, x_prev, y_prev
    x_prev = x_k + 2 * theta
    y_prev = y_k + 2 * theta
    open(UNIT=23,FILE="plotdata.txt")
    write(23, *) x_k, " ", y_k
    do while(sqrt((x_prev - x_k)**2+(y_prev - y_k)**2) > theta)
        call diff(x_k, y_k, dqx, dqy)
        x_prev = x_k
        y_prev = y_k
        x_k = x_k - delta * dqx
        y_k = y_k - delta * dqy
        write(23, *) x_k, " ", y_k
    enddo  
    close(23)
end subroutine graddescent

subroutine diff(x_k, y_k, dqx, dqy)
    real(kind=8), intent(in):: x_k, y_k
    real(kind=8), intent(out):: dqx, dqy
    dqx = 2 * x_k + y_k - 5
    dqy = 6 * y_k + x_k + 3
end subroutine diff