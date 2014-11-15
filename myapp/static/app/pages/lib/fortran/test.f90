subroutine test()
    open(12,file='test.txt',status='replace')
    write(12,*) "It is really nice to see you!"
    close(12)
end subroutine test